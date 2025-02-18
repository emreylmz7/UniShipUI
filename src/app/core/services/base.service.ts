import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../interfaces/api-response.interface';

export abstract class BaseService<T> {
  protected abstract endpoint: string;

  constructor(protected http: HttpClient) {}

  protected get baseUrl(): string {
    return `${environment.apiUrl}/${this.endpoint}`;
  }

  getAll(): Observable<ApiResponse<T[]>> {
    return this.http.get<ApiResponse<T[]>>(this.baseUrl);
  }

  getById(id: string): Observable<ApiResponse<T>> {
    return this.http.get<ApiResponse<T>>(`${this.baseUrl}/${id}`);
  }

  create(item: T): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(this.baseUrl, item);
  }

  update(id: string, item: T): Observable<ApiResponse<string>> {
    return this.http.put<ApiResponse<string>>(`${this.baseUrl}/${id}`, item);
  }

  delete(id: string): Observable<ApiResponse<string>> {
    return this.http.delete<ApiResponse<string>>(`${this.baseUrl}/${id}`);
  }
} 