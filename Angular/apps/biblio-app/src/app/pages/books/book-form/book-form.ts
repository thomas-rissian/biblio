import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { BooksService } from '@biblio-app/core/service/book.service';
import { CategoriesService } from '@biblio-app/core/service/categorie.service';
import { AuthorsService } from '@biblio-app/core/service/author.service';
import { BookModel } from '@biblio-app/models/index';
import { AuthorSelect } from '@biblio-app/components/author-select/author-select';
import { MultiCheckbox } from '@libs/ui/inputs/multi-checkbox/multi-checkbox';
import { TextAreaField } from '@libs/ui/inputs/textAreaField/textAreaField';
import { TextField } from '@libs/ui/inputs/textField/textField';
import { AuthorForm } from "@biblio-app/pages/authors/author-form/author-form";

@Component({
  selector: 'app-book-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TextField, TextAreaField, AuthorSelect, MultiCheckbox],
  templateUrl: './book-form.html',
})
export class BookForm implements OnInit, OnDestroy {
  @Input() book?: BookModel;
  @Output() save = new EventEmitter<BookModel>();
  @Output() cancel = new EventEmitter<void>();

  form!: FormGroup;
  error?: string;
  authors: any[] = [];
  categories: any[] = [];
  private destroy$ = new Subject<void>();
  private authorsLoaded: boolean = false;
  private categoriesLoaded: boolean = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private booksService: BooksService,
    private authorsService: AuthorsService,
    private categoriesService: CategoriesService
    , private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [this.book?.id ?? null],
      title: [this.book?.title ?? '', [Validators.required, Validators.minLength(1)]],
      authorId: [this.book?.authorId ?? null, Validators.required],
      publicationDate: [this.book?.publicationDate ? this.toISO(this.book.publicationDate) : ''],
      description: [this.book?.description ?? ''],
      categoryIds: [this.book?.categoryIds ?? []],
    });

    // load authors and categories list
    // The author-select component also loads authors itself, but keep it here if the form needs a local list
    this.authorsService.getAuthors(1, 100).pipe(takeUntil(this.destroy$)).subscribe((list) => { this.authors = list; this.authorsLoaded = true; try { this.cd.detectChanges(); } catch (e) {};
      // If a book is already loaded, re-apply the authorId control value to force the AuthorSelect to show
      if (this.book) {
        try { this.form.get('authorId')?.setValue(this.book.authorId ?? null); } catch(e) { console.error('Failed to update authorId control', e); }
        // if authors list doesn't contain the book author, fetch and append to authors so the select can display it
        const aid = this.book.authorId ?? null;
        if (aid && !this.authors.some(a => Number(a.id) === Number(aid))) {
          this.authorsService.getAuthorById(aid).pipe(takeUntil(this.destroy$)).subscribe({ next: (a) => { if (a) { this.authors = [a, ...this.authors]; try { this.cd.detectChanges(); } catch (e) {} } }, error: (err) => { console.error('Author fetch for authorId fallback failed', err); } });
        }
      }
      console.debug('Authors loaded count=', this.authors.length);
    });
    this.categoriesService.getCategories(1, 100).pipe(takeUntil(this.destroy$)).subscribe((list) => { this.categories = list; this.categoriesLoaded = true; try { this.cd.detectChanges(); } catch (e) {}
      // If a book is loaded, re-apply the categoryIds to trigger ControlValueAccessor writeValue
      if (this.book) {
        try { this.form.get('categoryIds')?.setValue(this.book.categoryIds ?? []); } catch(e) { console.error('Failed to update categoryIds control', e); }
        // ensure categories list contains all selected categories; if not, fetch missing ones and append
        const missing = (this.book.categoryIds ?? []).filter((cid: any) => !this.categories.some((c: any) => Number(c.id) === Number(cid)));
        if (missing && missing.length > 0) {
          missing.forEach((cid: any) => {
            this.categoriesService.getCategoryById(cid).pipe(takeUntil(this.destroy$)).subscribe({ next: (c) => { if (c) { this.categories = [c, ...this.categories]; try { this.cd.detectChanges(); } catch (e) {} } }, error: (err) => { console.error('Category fetch fallback failed', err); } });
          });
        }
      }
      console.debug('Categories loaded count=', this.categories.length);
    });

    // If no book passed via @Input, check route param 'id' and load it
    // subscribe to route param changes so the form adapts when clicking same route or update
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      const idParam = params.get('id');
      if (idParam) {
        const id = Number(idParam);
        if (!isNaN(id)) {
          this.loadBook(id);
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadBook(id: number) {
    this.booksService.getBookById(id).subscribe({
      next: (b) => {
        this.book = b;
        this.applyBookToForm();
      },
      error: () => { this.router.navigate(['/books']); }
    });
  }

  private applyBookToForm() {
    if (!this.book) return;
    const b = this.book;
    this.form.patchValue({
      id: b.id ?? null,
      title: b.title,
      authorId: b.authorId,
      publicationDate: b.publicationDate ? this.toISO(b.publicationDate) : '',
      description: b.description ?? '',
      categoryIds: b.categoryIds ?? [],
    });
    // explicitly set controls and force CD so custom controls reflect values right away
    try { this.form.get('authorId')?.setValue(b.authorId ?? null); } catch (e) {}
    try { this.form.get('categoryIds')?.setValue(b.categoryIds ?? []); } catch (e) {}
    try { this.cd.detectChanges(); } catch (e) {}
    // log for debug
    console.debug('Book loaded and form patched; authorId=', b.authorId, 'categoryIds=', b.categoryIds, 'authorsLoaded=', this.authorsLoaded, 'categoriesLoaded=', this.categoriesLoaded);
  }

  toISO(date: Date | string | undefined | null) {
    if (!date) return '';
    return (date instanceof Date) ? date.toISOString().slice(0,10) : (new Date(date)).toISOString().slice(0,10);
  }

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const raw = this.form.value;
    const book = new BookModel({
      id: raw.id ?? null,
      title: raw.title,
      authorId: raw.authorId ?? null,
      publicationDate: raw.publicationDate ?? null,
      description: raw.description ?? '',
      categoryIds: Array.isArray(raw.categoryIds) ? raw.categoryIds : [],
    });

    if (this.save.observers && this.save.observers.length > 0) { this.save.emit(book); return; }

    const call$ = book.id ? this.booksService.updateBook(book.id, book) : this.booksService.createBook(book);
    call$.subscribe({ next: () => this.router.navigate(['/books']), error: (err) => this.error = err?.message ?? 'Erreur lors de la sauvegarde' });
  }

  onCancel() { this.cancel.emit(); const idParam = this.route.snapshot.paramMap.get('id'); if (idParam) this.router.navigate(['/books']); }
}
