import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LibList as List } from '../../../../../../../libs/ui/components/list/list';
import { Subject, takeUntil, debounceTime, distinctUntilChanged, lastValueFrom } from 'rxjs';
import { BookModel } from '../../../model';
import { AuthorsService } from '@biblio-app/core/service/author.service';
import { CategoriesService } from '@biblio-app/core/service/categorie.service';
import { AuthorModel, CategoryModel } from '../../../model';
import { BooksService } from '@biblio-app/core/service/book.service';
import { Loader } from '@libs/ui/loader/loader';
import { AuthorSelect } from '@biblio-app/components/author-select/author-select';
import { CategorySelect } from '@biblio-app/components/category-select/category-select';
import { TextField } from '@libs/ui/inputs/textField/textField';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-books',
  imports: [CommonModule, List, Loader, FormsModule, AuthorSelect, CategorySelect, TextField],
  templateUrl: './list-books.html',
})
export class ListBooks implements OnInit, OnDestroy {
  @ViewChild(Loader, { static: true }) loader!: Loader;
  books: BookModel[] = [];
  allBooks: BookModel[] = [];
  filteredBooks: BookModel[] = [];
  authors: AuthorModel[] = [];
  categories: CategoryModel[] = [];
  filterAuthor?: number | null = null;
  filterCategory?: number | null = null;
  page: number = 1;
  pageSize: number = 10;
  totalCount?: number;
  error?: string;
  searchTerm: string = '';
  public search$ = new Subject<string>();
  onSearchChange(v: string) { this.search$.next(v); }

  private destroy$ = new Subject<void>();

  constructor(private booksService: BooksService, private authorsService: AuthorsService, private categoriesService: CategoriesService, private changeDetectorRef: ChangeDetectorRef, private router: Router) {}

  ngOnInit(): void {
    this.search$.pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$)).subscribe(v => { this.searchTerm = v; this.applyFiltersAndLoadPage(1); });
    this.loadAllData().then(() => this.applyFiltersAndLoadPage(this.page));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  async loadAllData(): Promise<void> {
    this.loader?.show?.();
    this.error = undefined;
    try {
      const [books, authors, categories] = await Promise.all([
        lastValueFrom(this.booksService.getBooks().pipe(takeUntil(this.destroy$))),
        lastValueFrom(this.authorsService.getAuthors().pipe(takeUntil(this.destroy$))),
        lastValueFrom(this.categoriesService.getCategories().pipe(takeUntil(this.destroy$))),
      ]);
      this.allBooks = books ?? [];
      this.authors = authors ?? [];
      this.categories = categories ?? [];
    } catch (err: any) {
      this.allBooks = [];
      this.authors = [];
      this.categories = [];
      this.error = err?.message ?? 'Erreur lors du chargement des données';
    } finally {
      this.loader?.hide?.();
      this.changeDetectorRef.detectChanges();
    }
  }

  applyFilters() {
    let list = [...this.allBooks];
    if (this.filterAuthor !== null && this.filterAuthor !== undefined) {
      list = list.filter(b => !!b.author && b.author.id === Number(this.filterAuthor));
    }
    if (this.filterCategory !== null && this.filterCategory !== undefined) {
      list = list.filter(b => b.categories && b.categories.some(c => c.id === Number(this.filterCategory)));
    }
    if (this.searchTerm && this.searchTerm.trim().length > 0) {
      const q = this.searchTerm.trim().toLowerCase();
      list = list.filter(b => (b.title ?? '').toLowerCase().includes(q));
    }
    this.filteredBooks = list;
    this.totalCount = list.length;
  }

  applyFiltersAndLoadPage(page: number) {
    this.applyFilters();
    this.page = page;
    this.books = [...this.filteredBooks];
    this.changeDetectorRef.detectChanges();
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
          this.loadAllData().then(() => this.applyFiltersAndLoadPage(1));
        },
        error: (err) => {
          this.loader?.hide?.();
          this.error = err?.message ?? 'Erreur lors de la suppression';
        }
      });
  }

  onFilterChange() { this.applyFiltersAndLoadPage(1); }
}
