import { Component, Input, OnInit, forwardRef, ChangeDetectorRef, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { AuthorsService } from '../../core/service/author.service';

@Component({
  selector: 'app-author-select',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './author-select.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AuthorSelect),
      multi: true,
    },
  ],
})
export class AuthorSelect implements ControlValueAccessor, OnInit, OnChanges {
  @Input() title: string = 'Auteur';
  /** When true, the component displays the author name instead of input select */
  @Input() readonly: boolean = false;
  /** External authors array provided by parent - if present, avoid internal fetch */
  @Input() externalAuthors?: any[];
  authors: any[] = [];
  /** Keep selectedId as number to be consistent with the model */
  selectedId?: number | null = null;
  disabled = false;

  private onChange = (_: any) => {};
  private onTouched = () => {};

  constructor(private authorsService: AuthorsService, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    // if parent provides authors array, use it, otherwise fetch
    if (this.externalAuthors && this.externalAuthors.length) {
      this.authors = this.externalAuthors;
    } else {
      this.authorsService.getAuthors(1, 1000).subscribe({ next: (list) => {
        this.authors = list;
        // force change detection so the select options are rendered and selection applied
        try { this.cd.detectChanges(); } catch (e) {}
      }});
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    // if the parent passed an external authors list, sync it
    if (changes['externalAuthors'] && Array.isArray(changes['externalAuthors'].currentValue)) {
      this.authors = changes['externalAuthors'].currentValue ?? [];
    }
    // ensure select reflects the current value when inputs change
    try { this.cd.detectChanges(); } catch (e) {}
  }

  writeValue(obj: any): void {
    const num = obj === null || obj === undefined || obj === '' ? null : Number(obj);
    this.selectedId = Number.isNaN(num) ? null : num;
    try { this.cd.detectChanges(); } catch (e) {}
    console.debug('AuthorSelect writeValue called; selectedId=', this.selectedId);
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

  get selectedAuthorName(): string | undefined {
    const id = this.selectedId === null ? null : Number(this.selectedId);
    const a = this.authors?.find((x: any) => Number(x.id) === Number(id));
    return a ? (a.name ?? `${a.firstName ?? ''} ${a.lastName ?? ''}`.trim()) : undefined;
  }
}
