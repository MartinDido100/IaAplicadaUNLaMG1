import { HttpClient } from '@angular/common/http';
import { inject, Injectable, WritableSignal, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { AuthResponse, User } from '../interfaces/Auth';
import { tap } from 'rxjs';

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
      })
    );
  }

  persistLogin() {
    const loggedUser = JSON.parse(localStorage.getItem('loggedUser') || 'null') as AuthResponse | null;
    if (loggedUser) {
      this.loggedUser.set(loggedUser);
    }
  }

  logout(){
    localStorage.removeItem('loggedUser');
    this.loggedUser.set(null);
  }
}
