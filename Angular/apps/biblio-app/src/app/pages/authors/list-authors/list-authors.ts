import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LibList as List } from '../../../../../../../libs/ui/components/list/list';
import { AuthorForm } from '../author-form/author-form';
import { Subject, takeUntil } from 'rxjs';
import { AuthorModel } from '../../../model';
import { AuthorsService } from '@biblio-app/core/service/author.service';
import { Loader } from '../../../../../../../libs/ui/loader/loader';

@Component({
  selector: 'app-list-authors',
  standalone: true,
  imports: [CommonModule, List, Loader, AuthorForm],
  templateUrl: './list-authors.html',
})
export class ListAuthors implements OnInit, OnDestroy {
  @ViewChild(Loader, { static: true }) loader!: Loader;
  authors: AuthorModel[] = [];
  page: number = 1;
  pageSize: number = 10;
  totalCount?: number;
  error?: string;

  private destroy$ = new Subject<void>();

  constructor(private authorsService: AuthorsService, private changeDetectorRef: ChangeDetectorRef, private router: Router) {}
  showCreate: boolean = false;
  editingAuthor?: AuthorModel;

  ngOnInit(): void {
    this.loadPage(this.page);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  goToCreate() {
    this.router.navigate(['/authors', 'create']);
  }

  loadPage(page: number) {
    this.loader?.show?.();
    this.error = undefined;
    this.authorsService.getAuthorsWithMeta(page, this.pageSize)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resp) => {
          this.authors = resp.items;
          this.totalCount = resp.meta?.total;
          // prefer server-provided page/pageSize if present
          this.page = resp.meta?.page ?? page;
          this.pageSize = resp.meta?.pageSize ?? this.pageSize;
          this.loader?.hide?.();
          this.changeDetectorRef.detectChanges();
        },
        error: (err) => {
          this.authors = [];
          this.error = err?.message ?? 'Erreur lors du chargement des auteurs';
          this.loader?.hide?.();
        }
      });
  }

  onPageChange(event: { page: number; pageSize: number }) {
    this.pageSize = event.pageSize;
    this.loadPage(event.page);
  }

  onEdit(id: number) {
    // navigate to routed author form for editing
    this.router.navigate(['/authors', id, 'edit']);
  }

  onDetail(id: number) {
    this.router.navigate(['/authors', id]);
  }

  onRemove(id: number) {
    this.loader?.show?.();
    this.authorsService.deleteAuthor(id)
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

  onCreate(author: AuthorModel) {
    const call$ = author.id ? this.authorsService.updateAuthor(author.id, author) : this.authorsService.createAuthor(author);
    call$.subscribe({
      next: (a) => {
      this.showCreate = false;
      this.editingAuthor = undefined;
        // if we came from a routed form, navigate back to authors list
        this.router.navigate(['/authors']);
        this.loadPage(this.page);
      },
      error: (err) => { this.error = err?.message ?? 'Erreur création'; }
    });
  }
}
