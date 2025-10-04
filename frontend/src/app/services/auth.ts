import { HttpClient } from '@angular/common/http';
import { inject, Injectable, WritableSignal, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { AuthResponse, User } from '../interfaces/Auth';
import { catchError, tap } from 'rxjs';

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

  register(email: string, name: string) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/signup/${email}`, { name }).pipe(
      tap(response => {
        localStorage.setItem('loggedUser', JSON.stringify(response));
        this.loggedUser.set({ email: response.email, displayName: response.displayName });
      })
    );
  }

  login(email: string) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login/${email}`, {}).pipe(
      tap(response => {
        localStorage.setItem('loggedUser', JSON.stringify(response));
        this.loggedUser.set({ email: response.email, displayName: response.displayName });
      }),
      catchError(err => {
        this.logout();
        throw "Error al iniciar sesión";
      })
    );
  }

  renewToken(email: string, loggedUser: AuthResponse) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login/${email}`, {}).pipe(
      tap(response => {
        loggedUser.token = response.token;
        console.log(loggedUser);
        localStorage.setItem('loggedUser', JSON.stringify(loggedUser));
      })
    )
  }

  persistLogin() {
    const currentLoggedUser = JSON.parse(localStorage.getItem('loggedUser') || 'null') as AuthResponse | null;
    if (currentLoggedUser) {
      this.loggedUser.set(currentLoggedUser);
      this.renewToken(currentLoggedUser.email, currentLoggedUser).subscribe();
    }
  }

  logout(){
    localStorage.removeItem('loggedUser');
    this.loggedUser.set(null);
  }
}
