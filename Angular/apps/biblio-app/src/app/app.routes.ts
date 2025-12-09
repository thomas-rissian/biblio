import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

export const routes: Routes = [
  { path: '', redirectTo: 'books', pathMatch: 'full' },
  { path: 'home', redirectTo: 'books', pathMatch: 'full' },
  { path: 'books/create', loadComponent: () => import('./pages/books/book-form/book-form').then(m => m.BookForm) },
  
  { path: 'books/:id/edit', loadComponent: () => import('./pages/books/book-form/book-form').then(m => m.BookForm) },
  { path: 'books/:id', loadComponent: () => import('./pages/books/book-detail/book-detail').then(m => m.BookDetail) },
  { path: 'books', loadComponent: () => import('./pages/books/list-books/list-books').then(m => m.ListBooks) },
  
  { path: 'authors/create', loadComponent: () => import('./pages/authors/author-form/author-form').then(m => m.AuthorForm) },
  { path: 'authors/:id/edit', loadComponent: () => import('./pages/authors/author-form/author-form').then(m => m.AuthorForm) },
  { path: 'authors/:id', loadComponent: () => import('./pages/authors/author-detail/author-detail').then(m => m.AuthorDetail) },
  { path: 'authors', loadComponent: () => import('./pages/authors/list-authors/list-authors').then(m => m.ListAuthors) },
  
  { path: 'categories/create', loadComponent: () => import('./pages/categories/category-form/category-form').then(m => m.CategoryForm) },
  { path: 'categories/:id', loadComponent: () => import('./pages/categories/category-form/category-form').then(m => m.CategoryForm) },
  { path: 'categories', loadComponent: () => import('./pages/categories/list-categories/list-categories').then(m => m.ListCategories) },
  
  { path: 'statistiques', loadComponent: () => import('./pages/statistique/statistique').then(m => m.Statistique) },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes, { useHash: false, onSameUrlNavigation: 'reload' }) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}