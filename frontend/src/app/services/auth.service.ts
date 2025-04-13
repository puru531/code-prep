import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  private apiUrl = environment.apiUrl;
  
  constructor(private http: HttpClient) {
    // Check if we have a user in localStorage (for persistence)
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
  }

  login(email: string, password: string): Observable<User> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, { email, password }).pipe(
      map(response => {
        if (response && response.token && response.user) {
          // Store user details and token in local storage to keep user logged in
          localStorage.setItem('currentUser', JSON.stringify(response.user));
          localStorage.setItem('token', response.token);
          this.currentUserSubject.next(response.user);
          return response.user;
        }
        throw new Error('Invalid response from server');
      }),
      catchError(error => {
        return throwError(() => new Error(error.error?.error || 'Failed to login'));
      })
    );
  }

  register(name: string, email: string, password: string): Observable<User> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register`, { name, email, password }).pipe(
      map(response => {
        if (response && response.token && response.user) {
          // Store user details and token in local storage
          localStorage.setItem('currentUser', JSON.stringify(response.user));
          localStorage.setItem('token', response.token);
          this.currentUserSubject.next(response.user);
          return response.user;
        }
        throw new Error('Invalid response from server');
      }),
      catchError(error => {
        return throwError(() => new Error(error.error?.error || 'Failed to register'));
      })
    );
  }

  logout(): void {
    // Clear user data from local storage and the BehaviorSubject
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  get currentUserObservable(): Observable<User | null> {
    return this.currentUserSubject.asObservable();
  }

  get isLoggedIn(): boolean {
    return !!this.currentUserSubject.value && !!this.getToken();
  }

  get isAdmin(): boolean {
    return this.currentUserSubject.value?.role === 'admin';
  }
}
