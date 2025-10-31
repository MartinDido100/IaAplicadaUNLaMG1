import { HttpClient } from '@angular/common/http';
import { inject, Injectable, WritableSignal, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { AuthResponse, User, VerifyTokenResponse } from '../interfaces/Auth';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;
  private loggedUser: WritableSignal<User | null> = signal(null);

  get user() {
    return this.loggedUser();
  }

  getFormError(field: string, error: string, form: FormGroup, submitted: boolean = false): boolean {
    const control = form.get(field);
    const hasError = control?.hasError(error) ?? false;
    return hasError && submitted;
  }

  register(email: string, name: string, password: string) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/signup/${email}`, { name, password }).pipe(
      tap(response => {
          localStorage.setItem('refreshToken', response.refreshToken);
          localStorage.setItem('accessToken', response.accessToken);
        this.loggedUser.set({ email: response.email, displayName: response.displayName });
      })
    );
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login/${email}`, { password }).pipe(
      tap(response => {
        localStorage.setItem('refreshToken', response.refreshToken);
        localStorage.setItem('accessToken', response.accessToken);
        this.loggedUser.set({ email: response.email, displayName: response.displayName });
      }),
      catchError(err => {
        this.logout();
        throw "Error al iniciar sesión";
      })
    );
  }

  verifyToken() {
    return this.http.post<VerifyTokenResponse>(`${this.apiUrl}/auth/verify`,{}).pipe(
      tap(response => {
        if (response.valid) {
          this.loggedUser.set({ email: response.email, displayName: response.displayName });
        }
      }),
      switchMap(response => {
        if (!response.valid) {
          return this.refreshToken(localStorage.getItem('refreshToken') || '').pipe(
            map(() => response.valid),
            catchError(() => of(false))
          );
        }
        return of(true);
      }),
    );
  }

  refreshToken(refreshToken: string) {
    return this.http.post<{accessToken: string}>(`${this.apiUrl}/auth/refresh`, { refreshToken }).pipe(
      tap(response => {
        localStorage.setItem('accessToken', response.accessToken);
      })
    );
  }

  logout(){
    localStorage.removeItem('loggedUser');
    this.loggedUser.set(null);
  }
}
