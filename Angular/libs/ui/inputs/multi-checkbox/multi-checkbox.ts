import { Component, EventEmitter, forwardRef, Input, Output, ChangeDetectorRef, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-multi-checkbox',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './multi-checkbox.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MultiCheckbox),
      multi: true,
    },
  ],
})
export class MultiCheckbox implements ControlValueAccessor, OnChanges {
  constructor(private cd: ChangeDetectorRef) {}
  @Input() data: any[] = [];
  @Input() title: string = '';
  @Input() paramId: string = 'id';
  @Input() paramLabel: string = 'name';

  value: any[] = [];
  disabled = false;

  private onChange: (v: any) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(obj: any): void {
    this.value = Array.isArray(obj) ? obj.map((v) => (v === null ? v : Number(v))) : [];
    console.debug('MultiCheckbox writeValue called; value=', this.value);
    try { this.cd.detectChanges(); } catch (e) {}
  }

  ngOnChanges(_: SimpleChanges) {
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

  isSelected(id: number | string): boolean {
    return this.value?.some((v: any) => Number(v) === Number(id));
  }

  toggle(id: number | string, checked: boolean) {
    const numId = Number(id);
    if (checked) {
      if (!this.isSelected(numId)) this.value = [...(this.value || []), numId];
    } else {
      this.value = (this.value || []).filter((v) => Number(v) !== numId);
    }
    this.onChange(this.value);
    this.onTouched();
    try { this.cd.detectChanges(); } catch (e) {}
    console.debug('MultiCheckbox toggle id=', id, 'checked=', checked, 'current=', this.value);
  }
}
