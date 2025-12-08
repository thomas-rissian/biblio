import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-list-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-item.html',
})
export class LibListItem {
  @Input() item: any;
  @Input() index!: number;
  @Input() globalIndex?: number;
  @Input() itemKey?: string;

  @Output() edit = new EventEmitter<number | string>();
  @Output() remove = new EventEmitter<number | string>();
  @Output() detail = new EventEmitter<number | string>();

  private getId(): number | string {
    if (!this.item) return this.index;
    if (this.item.id !== undefined) return this.item.id;
    if (this.itemKey && this.item[this.itemKey] !== undefined) return this.item[this.itemKey];
    return this.globalIndex ?? this.index;
  }

  onEdit() { this.edit.emit(this.getId()); }
  onRemove() { this.remove.emit(this.getId()); }
  onDetail() { this.detail.emit(this.getId()); }
}
