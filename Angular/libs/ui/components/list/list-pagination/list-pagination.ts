import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-list-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-pagination.html',
})
export class LibListPagination {
  @Input() page = 1;
  @Input() pageSize = 10;
  @Input() totalItems?: number;
  @Input() isLastPage?: boolean;
  @Input() serverSide = false;
  @Output() pageChange = new EventEmitter<{ page: number; pageSize: number }>();

  get totalPages(): number {
    if (!this.totalItems || this.totalItems <= 0) return 1;
    const size = (this.pageSize && this.pageSize > 0) ? this.pageSize : 10;
    const pages = Math.ceil(this.totalItems / size);
    // Cap pages to something reasonable so ngFor cannot create an infinitely large array
    const safePages = Number.isFinite(pages) ? Math.max(1, Math.min(10000, pages)) : 1;
    return safePages;
  }

  range(count: number): number[] {
    const c = Math.max(0, Math.min(10000, Math.floor(count || 0)));
    return Array.from({ length: c }, (_, i) => i + 1);
  }
  goTo(page: number) { const p = Math.min(Math.max(1, page), this.totalPages); this.page = p; this.pageChange.emit({ page: this.page, pageSize: this.pageSize }); }
  next() { if (this.isLastPage === true) return; this.goTo(this.page + 1); }
  prev() { this.goTo(this.page - 1); }
  setPageSize(size: number) {
    const s = Number(size);
    if (isNaN(s) || s <= 0) {
      
    }
    this.pageSize = (!isNaN(s) && s > 0) ? s : 10;
    this.goTo(1);
  }
}
