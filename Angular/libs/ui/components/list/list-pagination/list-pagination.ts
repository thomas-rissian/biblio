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

  get totalPages(): number { if (!this.totalItems || this.totalItems <= 0) return 1; return Math.max(1, Math.ceil(this.totalItems / this.pageSize)); }
  goTo(page: number) { const p = Math.min(Math.max(1, page), this.totalPages); this.page = p; this.pageChange.emit({ page: this.page, pageSize: this.pageSize }); }
  next() { if (this.isLastPage === true) return; this.goTo(this.page + 1); }
  prev() { this.goTo(this.page - 1); }
  setPageSize(size: number) { this.pageSize = size; this.goTo(1); }
}
