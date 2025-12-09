import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { LibList as List } from '@libs/ui/components/list/list';
import { TextField } from '@libs/ui/inputs/textField/textField';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { Router } from '@angular/router';
import { Subject, takeUntil, lastValueFrom } from 'rxjs';
import { CategoriesService } from '@biblio-app/core/service/categorie.service';
import { Loader } from '@libs/ui/loader/loader';
import { CategoryModel } from '@biblio-app/models/category.model';

@Component({
  selector: 'app-list-categories',
  standalone: true,
  imports: [CommonModule, List, Loader, FormsModule, TextField],
  templateUrl: './list-categories.html',
})
export class ListCategories implements OnInit, OnDestroy {
  @ViewChild(Loader, { static: true }) loader!: Loader;
  categories: CategoryModel[] = [];
  allCategories: CategoryModel[] = [];
  filteredCategories: CategoryModel[] = [];
  page: number = 1;
  pageSize: number = 10;
  totalCount?: number;
  error?: string;

  private destroy$ = new Subject<void>();
  searchTerm: string = '';
  public search$ = new Subject<string>();
  onSearchChange(v: string) { this.search$.next(v); }

  constructor(private categoriesService: CategoriesService, private changeDetectorRef: ChangeDetectorRef, private router: Router) {}

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
      const categories = await lastValueFrom(this.categoriesService.getCategories().pipe(takeUntil(this.destroy$)));
      this.allCategories = categories ?? [];
    } catch (err: any) {
      this.allCategories = [];
      this.error = err?.message ?? 'Erreur lors du chargement des catégories';
    } finally {
      this.loader?.hide?.();
      this.changeDetectorRef.detectChanges();
    }
  }

  applyFilters() {
    const q = this.searchTerm?.trim().toLowerCase();
    let list = [...this.allCategories];
    if (q && q.length > 0) {
      list = list.filter(c => (c.name ?? '').toLowerCase().includes(q));
    }
    this.filteredCategories = list;
    this.totalCount = list.length;
  }

  applyFiltersAndLoadPage(page: number) {
    this.applyFilters();
    this.page = page;
    this.categories = [...this.filteredCategories];
    this.changeDetectorRef.detectChanges();
  }

  

  onEdit(id: number) {
    this.router.navigate(['/categories', id]);
  }

  goToCreate() {
    this.router.navigate(['/categories', 'create']);
  }

  onDetail(id: number) {
  }

  onRemove(id: number) {
    this.loader?.show?.();
    this.categoriesService.deleteCategory(id)
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
}
