import { AuthorModel } from "../../model";
import { API_URL } from "../config/config";
import { Observable } from "rxjs";
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Injectable } from "@angular/core";

const BASE_URL = API_URL + '/authors';
@Injectable({
  providedIn: 'root'
})
export class AuthorsService {

    constructor(private http: HttpClient) {}

    getAuthors(page: number = 1, pageSize: number = 10, q?: string): Observable<AuthorModel[]> {
      let params = undefined as HttpParams | undefined;
      if (page !== undefined || pageSize !== undefined) {
        params = new HttpParams();
        if (page !== undefined) params = params.set('page', String(page));
        if (pageSize !== undefined) params = params.set('pageSize', String(pageSize));
        if (q !== undefined && q !== '') params = params.set('q', String(q));
      }
      return this.http.get<any>(BASE_URL, params ? { params } : undefined).pipe(
        map((resp: any) => {
          const list = Array.isArray(resp) ? resp : (resp?.items ?? resp);
          return (list || []).map((item: any) => AuthorModel.fromDto(item));
        })
      );
    }        
    getAuthorById(id: number): Observable<AuthorModel> {
      return this.http.get(`${BASE_URL}/${id}`).pipe(
        map((item: any) => AuthorModel.fromDto(item))
      );
    }

    createAuthor(author: AuthorModel): Observable<AuthorModel> {
      return this.http.post(BASE_URL, author.toDto(false)).pipe(
        map((item: any) => AuthorModel.fromDto(item))
      );
    }

    updateAuthor(id: number, author: AuthorModel): Observable<AuthorModel> {
      return this.http.put(`${BASE_URL}/${id}`, author.toDto(true)).pipe(
        map((item: any) => AuthorModel.fromDto(item))
      );
    }

    deleteAuthor(id: number): Observable<void> {
      return this.http.delete<void>(`${BASE_URL}/${id}`);
    }
}