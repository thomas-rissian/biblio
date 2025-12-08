import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { API_URL } from "../config/config";
import { BookModel } from "../../model";
const BASE_URL = API_URL + '/books';

@Injectable({
	providedIn: 'root'
})
export class BooksService {
	constructor(private http: HttpClient) {}

	getBooks(page?: number, pageSize?: number): Observable<BookModel[]> {
		let params = undefined as HttpParams | undefined;
		if (page !== undefined || pageSize !== undefined) {
			params = new HttpParams();
			if (page !== undefined) params = params.set('page', String(page));
			if (pageSize !== undefined) params = params.set('pageSize', String(pageSize));
		}
		return this.http.get<any>(BASE_URL, params ? { params } : undefined).pipe(
				map((resp: any) => {
					const list = Array.isArray(resp) ? resp : (resp?.items ?? resp);
					return (list || []).map((it: any) => BookModel.fromDto(it));
				})
			);
	}

	getBooksWithMeta(page?: number, pageSize?: number): Observable<{ items: BookModel[]; meta?: { total: number; page?: number; pageSize?: number; totalPages?: number } }> {
		let params = undefined as HttpParams | undefined;
		if (page !== undefined || pageSize !== undefined) {
			params = new HttpParams();
			if (page !== undefined) params = params.set('page', String(page));
			if (pageSize !== undefined) params = params.set('pageSize', String(pageSize));
		}
		return this.http.get<any>(BASE_URL, params ? { params } : undefined).pipe(
				map((resp: any) => {
					const list = Array.isArray(resp) ? resp : (resp?.items ?? resp);
					const meta = resp?.meta;
					return { items: (list || []).map((it: any) => BookModel.fromDto(it)), meta };
				})
			);
	}

	getBookById(id: number): Observable<BookModel> {
		return this.http.get(`${BASE_URL}/${id}`).pipe(
			map((item: any) => {
				console.debug('BooksService.getBookById: response', item);
				return BookModel.fromDto(item);
			})
		);
	}

	createBook(book: BookModel): Observable<BookModel> {
		return this.http.post(BASE_URL, book.toDto(false)).pipe(
			map((item: any) => BookModel.fromDto(item))
		);
	}

	updateBook(id: number, book: BookModel): Observable<BookModel> {
		return this.http.put(`${BASE_URL}/${id}`, book.toDto(true)).pipe(
			map((item: any) => BookModel.fromDto(item))
		);
	}

	deleteBook(id: number): Observable<void> {
		return this.http.delete<void>(`${BASE_URL}/${id}`);
	}

	getBooksByAuthor(authorId: number): Observable<BookModel[]> {
		return this.http.get<any>(`${BASE_URL}/author/${authorId}`).pipe(
			map((resp: any) => {
				const list = Array.isArray(resp) ? resp : (resp?.items ?? resp);
				return (list || []).map((it: any) => BookModel.fromDto(it));
			})
		);
	}

	deleteBooksByAuthor(authorId: number): Observable<void> {
		return this.http.delete<void>(`${BASE_URL}/author/${authorId}`);
	}

	getBooksByCategory(categoryId: number): Observable<BookModel[]> {
		return this.http.get<any>(`${BASE_URL}/categories/${categoryId}`).pipe(
			map((resp: any) => {
				const list = Array.isArray(resp) ? resp : (resp?.items ?? resp);
				return (list || []).map((it: any) => BookModel.fromDto(it));
			})
		);
	}

	deleteBooksByCategory(categoryId: number): Observable<void> {
		return this.http.delete<void>(`${BASE_URL}/categories/${categoryId}`);
	}
}

