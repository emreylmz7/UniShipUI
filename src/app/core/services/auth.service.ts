import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { LoginRequest } from '../interfaces/models.interface';
import { environment } from '../../../environments/environment';

interface LoginResponse {
  data: {
    accessToken: string;
  };
  errorMessages: string[] | null;
  isSuccessful: boolean;
  statusCode: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly EXPIRATION_KEY = 'token_expiration';
  
  isAuthenticated = signal<boolean>(this.hasValidToken());

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login(credentials: LoginRequest): Observable<LoginResponse> {
    console.log('Making login request to:', `${environment.apiUrl}/auth/login`);
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, credentials)
      .pipe(
        tap(response => {
          console.log('Auth service received response:', response);
          if (response.isSuccessful && response.data) {
            this.setSession(response.data.accessToken);
          }
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.EXPIRATION_KEY);
    this.isAuthenticated.set(false);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private setSession(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    // Token'ın süresi dolduğunda otomatik olarak çıkış yapılacak
    const expiration = new Date();
    expiration.setMinutes(expiration.getMinutes() + 30); // 30 dakika
    localStorage.setItem(this.EXPIRATION_KEY, expiration.toISOString());
    this.isAuthenticated.set(true);
  }

  private hasValidToken(): boolean {
    const token = localStorage.getItem(this.TOKEN_KEY);
    const expiration = localStorage.getItem(this.EXPIRATION_KEY);
    
    if (!token || !expiration) {
      return false;
    }

    return new Date(expiration) > new Date();
  }
} 