import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TextField } from '../../../../../../../libs/ui/inputs/textField/textField';
import { TextAreaField } from '../../../../../../../libs/ui/inputs/textAreaField/textAreaField';
import { AuthorModel } from '../../../model';
import { AuthorsService } from '@biblio-app/core/service/author.service';

@Component({
  selector: 'app-author-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TextField, TextAreaField],
  templateUrl: './author-form.html',
})
export class AuthorForm implements OnInit, AfterViewInit {
  @Input() author?: AuthorModel;
  @Output() save = new EventEmitter<AuthorModel>();
  @Output() cancel = new EventEmitter<void>();

  form!: FormGroup;
  error?: string;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private authorsService: AuthorsService) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [this.author?.id ?? null],
      name: [this.author?.name ?? '', [Validators.required, Validators.minLength(2)]],
      birthDate: [this.author?.birthDate ? this.toISO(this.author.birthDate) : '', Validators.required],
      deathDate: [this.author?.deathDate ? this.toISO(this.author.deathDate) : ''],
      biography: [this.author?.biography ?? '', Validators.required],
    });
  }

  ngAfterViewInit(): void {
    // If no author was provided via Input, check the route params and load the author from the API
    if (!this.author) {
      const idParam = this.route.snapshot.paramMap.get('id');
      if (idParam) {
        const id = parseInt(idParam, 10);
        if (!isNaN(id)) {
          this.authorsService.getAuthorById(id).subscribe({
            next: (a) => {
              this.author = a;
              this.form.patchValue({
                id: a.id ?? null,
                name: a.name ?? '',
                birthDate: a.birthDate ? this.toISO(a.birthDate) : '',
                deathDate: a.deathDate ? this.toISO(a.deathDate) : '',
                biography: a.biography ?? ''
              });
            },
            error: () => {
              // on error, navigate back to authors list
              this.router.navigate(['/authors']);
            }
          });
        }
      }
    }
  }

  toISO(date: Date | string | undefined | null) {
    if (!date) return '';
    return (date instanceof Date) ? date.toISOString().slice(0,10) : (new Date(date)).toISOString().slice(0,10);
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const raw = this.form.value;
    const author = new AuthorModel({
      id: raw.id ?? null,
      name: raw.name,
      birthDate: raw.birthDate ? new Date(raw.birthDate) : null,
      deathDate: raw.deathDate ? new Date(raw.deathDate) : null,
      biography: raw.biography,
    });
    // If there's a parent listening to save, use that (embedded mode)
    if (this.save.observers && this.save.observers.length > 0) {
      this.save.emit(author);
      return;
    }

    // Otherwise, handle save directly (routed mode)
    const call$ = author.id ? this.authorsService.updateAuthor(author.id, author) : this.authorsService.createAuthor(author);
    call$.subscribe({
      next: () => {
        this.router.navigate(['/authors']);
      },
      error: (err) => {
        this.error = err?.message ?? 'Erreur lors de la sauvegarde';
      }
    });
  }

  onCancel() {
    this.cancel.emit();
    // if we're in a routed context, go back to the authors list
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.router.navigate(['/authors']);
    }
  }
}
