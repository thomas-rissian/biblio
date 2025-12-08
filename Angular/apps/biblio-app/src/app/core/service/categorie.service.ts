import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { API_URL } from "../config/config";
import { CategoryModel } from "../../model";

const BASE_URL = API_URL + '/categories';

@Injectable({
	providedIn: 'root'
})
export class CategoriesService {
	constructor(private http: HttpClient) {}

	getCategories(page?: number, pageSize?: number): Observable<CategoryModel[]> {
		let params = undefined as HttpParams | undefined;
		if (page !== undefined || pageSize !== undefined) {
			params = new HttpParams();
			if (page !== undefined) params = params.set('page', String(page));
			if (pageSize !== undefined) params = params.set('pageSize', String(pageSize));
		}
		return this.http.get<any>(BASE_URL, params ? { params } : undefined).pipe(
			map((resp: any) => {
				const list = Array.isArray(resp) ? resp : (resp?.items ?? resp);
				return (list || []).map((it: any) => CategoryModel.fromDto(it));
			})
		);
	}

	getCategoryById(id: number): Observable<CategoryModel> {
		return this.http.get(`${BASE_URL}/${id}`).pipe(
			map((item: any) => CategoryModel.fromDto(item))
		);
	}

	createCategory(category: CategoryModel): Observable<CategoryModel> {
		return this.http.post(BASE_URL, category.toDto(false)).pipe(
			map((item: any) => CategoryModel.fromDto(item))
		);
	}

	updateCategory(id: number, category: CategoryModel): Observable<CategoryModel> {
		return this.http.put(`${BASE_URL}/${id}`, category.toDto(true)).pipe(
			map((item: any) => CategoryModel.fromDto(item))
		);
	}

	deleteCategory(id: number): Observable<void> {
		return this.http.delete<void>(`${BASE_URL}/${id}`);
	}

	countBookCategories(): Observable<number> {
		return this.http.get(`${BASE_URL}/books/count`).pipe(
			map((res: any) => (typeof res === 'number' ? res : (res?.count ?? 0)))
		);
	}
    
	getCategoriesWithMeta(page?: number, pageSize?: number): Observable<{ items: CategoryModel[]; meta?: { total: number; page?: number; pageSize?: number; totalPages?: number } }> {
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
				return { items: (list || []).map((it: any) => CategoryModel.fromDto(it)), meta };
			})
		);
	}

}