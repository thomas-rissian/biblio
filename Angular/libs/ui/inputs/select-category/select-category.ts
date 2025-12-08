import { Component, forwardRef, Input, OnInit, ViewChild } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SelectField } from '../selectField/selectField';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-select-category',
  standalone: true,
  imports: [CommonModule, SelectField],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectCategory),
      multi: true,
    },
  ],
  templateUrl: './select-category.html',
})
export class SelectCategory implements ControlValueAccessor, OnInit {
  @Input() title = 'Catégorie';
  @Input() placeholder = 'Sélectionner...';
  @Input() paramData: string[] = ['name'];
  @ViewChild(SelectField) selectField!: SelectField;

  data: any[] = [];
  private onChange: (v: any) => void = () => {};
  private onTouched: () => void = () => {};

  @Input() url: string = '/categories';
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // fetch categories
    const url = `${this.url}?page=1&pageSize=100`;
    this.http.get<any>(url).pipe(catchError(() => of([]))).subscribe((resp: any) => { this.data = Array.isArray(resp) ? resp : (resp?.items ?? resp); });
  }

  writeValue(obj: any): void {
    this.selectField?.writeValue(obj ?? null);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (this.selectField && typeof (this.selectField as any).setDisabledState === 'function') (this.selectField as any).setDisabledState(isDisabled);
  }

  // select-field emits valueChange
  onValueChange(v: any) {
    this.onChange(v);
  }
}
