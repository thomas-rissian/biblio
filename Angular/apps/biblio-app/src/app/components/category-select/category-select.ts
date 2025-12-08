import { Component, Input, OnInit, forwardRef, ChangeDetectorRef, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { CategoriesService } from '../../core/service/categorie.service';

@Component({
  selector: 'app-category-select',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './category-select.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CategorySelect),
      multi: true,
    },
  ],
})
export class CategorySelect implements ControlValueAccessor, OnInit, OnChanges {
  @Input() title: string = 'Categorie';
  @Input() readonly: boolean = false;
  @Input() externalCategories?: any[];
  categories: any[] = [];
  selectedId?: number | null = null;
  disabled = false;

  private onChange = (_: any) => {};
  private onTouched = () => {};

  constructor(private categoriesService: CategoriesService, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    if (this.externalCategories && this.externalCategories.length) {
      this.categories = this.externalCategories;
    } else {
      this.categoriesService.getCategories(1, 1000).subscribe({ next: (list) => {
        this.categories = list;
        try { this.cd.detectChanges(); } catch (e) {}
      }});
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['externalCategories'] && Array.isArray(changes['externalCategories'].currentValue)) {
      this.categories = changes['externalCategories'].currentValue ?? [];
    }
    try { this.cd.detectChanges(); } catch (e) {}
  }

  writeValue(obj: any): void {
    const num = obj === null || obj === undefined || obj === '' ? null : Number(obj);
    this.selectedId = Number.isNaN(num) ? null : num;
    try { this.cd.detectChanges(); } catch (e) {}
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onSelectChange(value: any) {
    const idNum = value === '' || value === null ? null : Number(value);
    this.selectedId = idNum === null ? null : idNum;
    this.onChange(idNum);
  }

  get selectedCategoryName(): string | undefined {
    const id = this.selectedId === null ? null : Number(this.selectedId);
    const c = this.categories?.find((x: any) => Number(x.id) === Number(id));
    return c ? (c.name ?? `${c.name ?? ''}`.trim()) : undefined;
  }
}
