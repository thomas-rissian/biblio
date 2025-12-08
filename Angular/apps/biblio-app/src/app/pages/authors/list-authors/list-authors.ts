import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LibList as List } from '../../../../../../../libs/ui/components/list/list';
import { TextField } from '@libs/ui/inputs/textField/textField';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { AuthorForm } from '../author-form/author-form';
import { Subject, takeUntil, lastValueFrom } from 'rxjs';
import { AuthorModel } from '../../../model';
import { AuthorsService } from '@biblio-app/core/service/author.service';
import { Loader } from '@libs/ui/loader/loader';

@Component({
  selector: 'app-list-authors',
  standalone: true,
  imports: [CommonModule, List, Loader, AuthorForm, FormsModule, TextField],
  templateUrl: './list-authors.html',
})
export class ListAuthors implements OnInit, OnDestroy {
  @ViewChild(Loader, { static: true }) loader!: Loader;
  authors: AuthorModel[] = [];
  allAuthors: AuthorModel[] = [];
  filteredAuthors: AuthorModel[] = [];
  page: number = 1;
  pageSize: number = 10;
  totalCount?: number;
  error?: string;

  private destroy$ = new Subject<void>();
  searchTerm: string = '';
  public search$ = new Subject<string>();
  onSearchChange(v: string) { this.search$.next(v); }

  constructor(private authorsService: AuthorsService, private changeDetectorRef: ChangeDetectorRef, private router: Router) {}
  showCreate: boolean = false;
  editingAuthor?: AuthorModel;

  ngOnInit(): void {
    this.search$.pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$)).subscribe(v => { this.searchTerm = v; this.applyFiltersAndLoadPage(1); });
    this.loadAllData().then(() => this.applyFiltersAndLoadPage(this.page));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  goToCreate() {
    this.router.navigate(['/authors', 'create']);
  }

  async loadAllData(): Promise<void> {
    this.loader?.show?.();
    this.error = undefined;
    try {
      const authors = await lastValueFrom(this.authorsService.getAuthors().pipe(takeUntil(this.destroy$)));
      this.allAuthors = authors ?? [];
    } catch (err: any) {
      this.allAuthors = [];
      this.error = err?.message ?? 'Erreur lors du chargement des auteurs';
    } finally {
      this.loader?.hide?.();
      this.changeDetectorRef.detectChanges();
    }
  }

  applyFilters() {
    const q = this.searchTerm?.trim().toLowerCase();
    let list = [...this.allAuthors];
    if (q && q.length > 0) {
      list = list.filter(a => (a.name ?? '').toLowerCase().includes(q));
    }
    this.filteredAuthors = list;
    this.totalCount = list.length;
  }

  applyFiltersAndLoadPage(page: number) {
    this.applyFilters();
    this.page = page;
    this.authors = [...this.filteredAuthors];
    this.changeDetectorRef.detectChanges();
  }

  

  onEdit(id: number) {
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
          this.loadAllData().then(() => this.applyFiltersAndLoadPage(1));
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
        this.router.navigate(['/authors']);
        
      },
      error: (err) => { this.error = err?.message ?? 'Erreur création'; }
    });
  }
}
