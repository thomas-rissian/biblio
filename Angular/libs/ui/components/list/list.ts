import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, TemplateRef } from '@angular/core';
import { LibListItem } from './list-item/list-item';
import { LibListPagination } from './list-pagination/list-pagination';
@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, LibListItem, LibListPagination],
  templateUrl: './list.html',
})
export class LibList implements OnChanges {
  @Input() title: string = '';
  private _list: any[] = [];
  @Input()
  get list(): any[] { return this._list; }
  set list(value: any[]) {
    this._list = Array.isArray(value) ? value : [];
    if (!this.serverSide) this.page = this.initialPage ?? 1;
  }
  @Input() itemKey: string = '';
  @Input() pageSizeOptions: number[] = [5, 10, 25];
  @Input() pageSize: number = 10;
  @Input() initialPage: number = 1;
  @Input() showControls: boolean = false;
  @Input() noDataMessage: string = 'Aucun élément';
  @Input() itemTemplate?: TemplateRef<any>;
  @Input() serverSide: boolean = false;
  @Input() totalCount?: number;

  @Output() removeMode = new EventEmitter<number>();
  @Output() editMode = new EventEmitter<number>();
  @Output() detailMode = new EventEmitter<number>();
  @Output() pageChange = new EventEmitter<{ page: number; pageSize: number }>();

  private _page: number = this.initialPage ?? 1;
  @Input()
  get page(): number { return this._page; }
  set page(value: number) {
    if (value === undefined || value === null) return;
    const v = Number(value);
    if (!isNaN(v) && v >= 1) this._page = v;
  }
  Math: any = Math;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['list'] || changes['initialPage']) {
      this.page = this.initialPage ?? 1;
      if (this.pageSize <= 0) this.pageSize = 10;
    }
    if (changes['totalCount'] && this.serverSide && this.totalCount !== undefined) {
      const maxPages = this.totalPages;
      if (this.page > maxPages) this.page = maxPages;
    }
  }

  get totalItems(): number {
    if (this.serverSide) return this.totalCount ?? (this.list?.length ?? 0);
    return this.list?.length ?? 0;
  }

  get totalPages(): number {
    const size = (this.pageSize && this.pageSize > 0) ? this.pageSize : 10;
    const pages = Math.ceil(this.totalItems / size);
    const safePages = Number.isFinite(pages) ? Math.max(1, Math.min(10000, pages)) : 1;
    return safePages;
  }

  range(count: number): number[] {
    const c = Math.max(0, Math.min(10000, Math.floor(count || 0)));
    return Array.from({ length: c }, (_, i) => i + 1);
  }

  get paginatedItems(): any[] {
    if (!this.list || this.list.length === 0) return [];
    if (this.serverSide) return this.list;
    const start = (this.page - 1) * this.pageSize;
    return this.list.slice(start, start + this.pageSize);
  }

  get isLastPage(): boolean {
    if (!this.serverSide) return false;
    if (this.totalCount !== undefined) return this.page >= this.totalPages;
    if (!this.list) return true;
    return this.list.length < this.pageSize;
  }

  private emitPageChange() { if (this.serverSide) this.pageChange.emit({ page: this.page, pageSize: this.pageSize }); }
  goToPage(page: number) { const p = Math.min(Math.max(1, page), this.totalPages); this.page = p; this.emitPageChange(); }
  nextPage() { this.goToPage(this.page + 1); }
  prevPage() { this.goToPage(this.page - 1); }
  firstPage() { this.goToPage(1); }
  lastPage() { this.goToPage(this.totalPages); }
  setPageSize(size: number) {
    const s = Number(size);
    if (isNaN(s) || s <= 0) {
      
    }
    this.pageSize = (!isNaN(s) && s > 0) ? s : 10;
    this.page = Math.min(this.page, this.totalPages);
    this.emitPageChange();
  }

  onPageSizeChange(event: Event) {
    const sizeStr = (event.target as HTMLSelectElement)?.value;
    const s = Number(sizeStr);
    this.setPageSize(s);
  }
  trackByFn(index: number, item: any) { if (!item) return index; if (item.id !== undefined) return item.id; if (this.itemKey && item[this.itemKey] !== undefined) return item[this.itemKey]; return index; }
  private getItemId(item: any, indexInPage: number): number { if (!item) return indexInPage; const indexGlobal = (this.page - 1) * this.pageSize + indexInPage; if (item.id !== undefined) return item.id; if (this.itemKey && item[this.itemKey] !== undefined) return item[this.itemKey]; return indexGlobal; }
  edit(id: number | string) { this.editMode.emit(id as any); }
  detail(id: number | string) { this.detailMode.emit(id as any); }
  remove(id: number | string) { this.removeMode.emit(id as any); }
}
