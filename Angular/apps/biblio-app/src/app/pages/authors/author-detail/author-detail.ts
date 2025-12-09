import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthorsService } from '@biblio-app/core/service/author.service';
import { timeout, catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { Loader } from '@libs/ui/loader/loader';
import { ViewChild } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { BooksService } from '@biblio-app/core/service/book.service';
import { AuthorModel, BookModel } from '@biblio-app/models/index';
import { AuthorCard } from '@biblio-app/components/author-card/author-card';

@Component({
  selector: 'app-author-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, Loader, AuthorCard],
  templateUrl: './author-detail.html',
})
export class AuthorDetail implements OnInit, OnDestroy {
  author?: AuthorModel;
  books: BookModel[] = [];
  error?: string;
  loading: boolean = false;
  booksLoading: boolean = false;
  @ViewChild(Loader, { static: true }) loader!: Loader;

  private sub: any;
  constructor(private route: ActivatedRoute, private router: Router, private authorsService: AuthorsService, private booksService: BooksService, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.sub = this.route.paramMap.subscribe((params) => {
      const idParam = params.get('id');
      if (!idParam) { this.router.navigate(['/authors']); return; }
      const id = Number(idParam);
      if (isNaN(id)) { this.router.navigate(['/authors']); return; }
      this.loading = true; this.author = undefined; this.error = undefined; this.books = [];
      try { this.loader?.show?.(); } catch(e) {}
      
      this.authorsService.getAuthorById(id).pipe(timeout(5000), catchError(() => of(null)), finalize(() => { this.loading = false; try { this.loader?.hide?.(); this.cd.detectChanges(); } catch (e) {} })).subscribe({
        next: (a) => { if (a) { this.author = Object.assign({}, a); try { this.cd.detectChanges(); } catch (e) {} } else { this.error = 'Erreur lors du chargement (timeout)'; } },
        error: (err) => { this.error = 'Auteur introuvable'; }
      });
      this.booksLoading = true;
      this.books = [];
      this.books = [];
      this.booksService.getBooksByAuthor(id).pipe(
        timeout(5000),
        catchError(() => of([] as BookModel[])),
        finalize(() => { this.booksLoading = false; try { this.cd.detectChanges(); } catch (e) {} })
      ).subscribe({
        next: (items) => { this.books = items ?? []; try { this.cd.detectChanges(); } catch (e) {} },
        error: () => {}
      });
    });
  }
  ngOnDestroy(): void {
    if (this.sub) this.sub.unsubscribe();
  }

  goEdit() {
    if (!this.author) return;
    this.router.navigate(['/authors', this.author.id, 'edit']);
  }
}
