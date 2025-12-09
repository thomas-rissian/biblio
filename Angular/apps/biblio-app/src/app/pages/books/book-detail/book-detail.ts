import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Loader } from '@libs/ui/loader/loader';
import { ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BooksService } from '@biblio-app/core/service/book.service';
import { timeout, catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import { BookModel } from '@biblio-app/models/index';
import { AuthorCard } from '@biblio-app/components/author-card/author-card';

@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, Loader, AuthorCard],
  templateUrl: './book-detail.html',
})
export class BookDetail implements OnInit, OnDestroy {
  book?: BookModel;
  error?: string;
  loading: boolean = false;

  private sub: any;
  constructor(private route: ActivatedRoute, private router: Router, private booksService: BooksService, private cd: ChangeDetectorRef) {}

  @ViewChild(Loader, { static: true }) loader!: Loader;
  ngOnInit(): void {
    this.sub = this.route.paramMap.subscribe((params) => {
      const idParam = params.get('id');
      if (!idParam) { this.router.navigate(['/books']); return; }
      const id = Number(idParam);
      if (isNaN(id)) { this.router.navigate(['/books']); return; }
      this.loading = true; this.book = undefined; this.error = undefined;
      try { this.loader?.show?.(); } catch(e) {}
      this.booksService.getBookById(id).pipe(timeout(5000), catchError((err) => of(null)), finalize(() => { this.loading = false; try { this.loader?.hide?.(); this.cd.detectChanges(); } catch (e) {} })).subscribe({
        next: (b) => { if (b) { this.book = Object.assign({}, b); try { this.cd.detectChanges(); } catch (e) {} } else { this.error = 'Erreur lors du chargement (timeout)'; } },
        error: (err) => { this.error = 'Livre introuvable'; }
      });
    });
  }

  ngOnDestroy(): void {
    if (this.sub) this.sub.unsubscribe();
  }

  goEdit() {
    if (!this.book) return;
    this.router.navigate(['/books', this.book.id, 'edit']);
  }
  reload() {
    const id = this.book?.id;
    if (!id) return;
    
    this.loading = true;
    this.booksService.getBookById(id).pipe(timeout(5000), catchError((err) => of(null)), finalize(() => { this.loading = false; try { this.cd.detectChanges(); } catch (e) {} })).subscribe({
      next: (b) => { if (b) { this.book = Object.assign({}, b); try { this.cd.detectChanges(); } catch (e) {} } else { this.error = 'Erreur lors du chargement (timeout)'; } },
      error: (err) => { this.error = 'Livre introuvable'; }
    });
  }
}
