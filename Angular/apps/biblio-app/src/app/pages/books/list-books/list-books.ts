import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { LibList as List } from '../../../../../../../libs/ui/components/list/list';
import { Subject, takeUntil } from 'rxjs';
import { BookModel } from '../../../model';
import { BooksService } from '@biblio-app/core/service/book.service';
import { Loader } from '../../../../../../../libs/ui/loader/loader';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-books',
  imports: [CommonModule, List, Loader],
  templateUrl: './list-books.html',
})
export class ListBooks implements OnInit, OnDestroy {
  @ViewChild(Loader, { static: true }) loader!: Loader;
  books: BookModel[] = [];
  page: number = 1;
  pageSize: number = 10;
  totalCount?: number;
  error?: string;

  private destroy$ = new Subject<void>();

  constructor(private booksService: BooksService, private changeDetectorRef: ChangeDetectorRef, private router: Router) {}

  ngOnInit(): void {
    this.loadPage(this.page);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadPage(page: number) {
    this.loader?.show?.();
    this.error = undefined;
    this.booksService.getBooksWithMeta(page, this.pageSize)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resp) => {
          this.books = resp.items;
          this.totalCount = resp.meta?.total;
          this.page = resp.meta?.page ?? page;
          this.pageSize = resp.meta?.pageSize ?? this.pageSize;
          this.loader?.hide?.();
          this.changeDetectorRef.detectChanges();
        },
        error: (err) => {
          this.books = [];
          this.error = err?.message ?? 'Erreur lors du chargement des livres';
          this.loader?.hide?.();
        }
      });
  }

  onPageChange(event: { page: number; pageSize: number }) {
    this.pageSize = event.pageSize;
    this.loadPage(event.page);
  }

  onEdit(id: number) {
    this.router.navigate(['/books', id, 'edit']);
  }

  goToCreate() {
    this.router.navigate(['/books', 'create']);
  }

  onDetail(id: number) {
    this.router.navigate(['/books', id]);
  }

  onRemove(id: number) {
    this.loader?.show?.();
    this.booksService.deleteBook(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loadPage(this.page);
        },
        error: (err) => {
          this.loader?.hide?.();
          this.error = err?.message ?? 'Erreur lors de la suppression';
        }
      });
  }
}
