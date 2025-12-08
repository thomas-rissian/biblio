import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TextField } from '../../../../../../../libs/ui/inputs/textField/textField';
import { CategoriesService } from '@biblio-app/core/service/categorie.service';
import { CategoryModel } from '../../../model';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TextField],
  templateUrl: './category-form.html',
})
export class CategoryForm implements OnInit, AfterViewInit {
  @Input() category?: CategoryModel;
  @Output() save = new EventEmitter<CategoryModel>();
  @Output() cancel = new EventEmitter<void>();

  form!: FormGroup;
  error?: string;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private categoriesService: CategoriesService) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [this.category?.id ?? null],
      name: [this.category?.name ?? '', Validators.required],
    });
  }

  ngAfterViewInit(): void {
    if (!this.category) {
      const idParam = this.route.snapshot.paramMap.get('id');
      if (idParam) {
        const id = parseInt(idParam, 10);
        if (!isNaN(id)) {
          this.categoriesService.getCategoryById(id).subscribe({
            next: (c) => {
              this.category = c;
              this.form.patchValue({ id: c.id ?? null, name: c.name ?? '' });
            },
            error: () => this.router.navigate(['/categories'])
          });
        }
      }
    }
  }

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const raw = this.form.value;
    const category = new CategoryModel({ id: raw.id ?? null, name: raw.name });
    if (this.save.observers && this.save.observers.length > 0) { this.save.emit(category); return; }
    const call$ = category.id ? this.categoriesService.updateCategory(category.id, category) : this.categoriesService.createCategory(category);
    call$.subscribe({ next: () => this.router.navigate(['/categories']), error: (err) => this.error = err?.message ?? 'Erreur lors de la sauvegarde' });
  }

  onCancel() { this.cancel.emit(); const idParam = this.route.snapshot.paramMap.get('id'); if (idParam) this.router.navigate(['/categories']); }
}
