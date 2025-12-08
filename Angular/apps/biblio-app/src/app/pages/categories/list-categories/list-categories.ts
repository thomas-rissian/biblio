import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { LibList as List } from '../../../../../../../libs/ui/components/list/list';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CategoryModel } from '../../../model';
import { CategoriesService } from '@biblio-app/core/service/categorie.service';
import { Loader } from '../../../../../../../libs/ui/loader/loader';

@Component({
  selector: 'app-list-categories',
  standalone: true,
  imports: [CommonModule, List, Loader],
  templateUrl: './list-categories.html',
})
export class ListCategories implements OnInit, OnDestroy {
  @ViewChild(Loader, { static: true }) loader!: Loader;
  categories: CategoryModel[] = [];
  page: number = 1;
  pageSize: number = 10;
  totalCount?: number;
  error?: string;

  private destroy$ = new Subject<void>();

  constructor(private categoriesService: CategoriesService, private changeDetectorRef: ChangeDetectorRef, private router: Router) {}

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
    this.categoriesService.getCategoriesWithMeta(page, this.pageSize)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resp) => {
          this.categories = resp.items;
          this.totalCount = resp.meta?.total;
          this.page = resp.meta?.page ?? page;
          this.pageSize = resp.meta?.pageSize ?? this.pageSize;
          this.loader?.hide?.();
          this.changeDetectorRef.detectChanges();
        },
        error: (err) => {
          this.categories = [];
          this.error = err?.message ?? 'Erreur lors du chargement des catégories';
          this.loader?.hide?.();
        }
      });
  }

  onPageChange(event: { page: number; pageSize: number }) {
    this.pageSize = event.pageSize;
    this.loadPage(event.page);
  }

  onEdit(id: number) {
    this.router.navigate(['/categories', id]);
  }

  goToCreate() {
    this.router.navigate(['/categories', 'create']);
  }

  onDetail(id: number) {
    // handle detail
  }

  onRemove(id: number) {
    this.loader?.show?.();
    this.categoriesService.deleteCategory(id)
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
