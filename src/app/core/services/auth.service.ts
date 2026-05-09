import { Injectable, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'buyer' | 'seller' | 'admin';
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _user = signal<User | null>(null);
  private returnUrl: string | null = null;

  readonly user = this._user.asReadonly();
  readonly isLogged = computed(() => !!this._user());
  readonly isAdmin = computed(() => this._user()?.role === 'admin');

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  setReturnUrl(url: string) {
    this.returnUrl = url;
  }

  login(credentials: LoginDto) {
    return this.http.post<AuthResponse>('/api/auth/login', credentials).pipe(
      tap(res => {
        localStorage.setItem('token', res.token);
        this._user.set(res.user);
        const target = this.returnUrl || '/marketplace';
        this.returnUrl = null;
        this.router.navigateByUrl(target);
      }),
    );
  }

  register(data: { name: string; email: string; password: string }) {
    return this.http.post<AuthResponse>('/api/auth/register', data).pipe(
      tap(res => {
        localStorage.setItem('token', res.token);
        this._user.set(res.user);
        this.router.navigateByUrl('/marketplace');
      }),
    );
  }

  logout() {
    localStorage.removeItem('token');
    this._user.set(null);
    this.router.navigateByUrl('/');
  }

  loadUser() {
    const token = localStorage.getItem('token');
    if (!token) return;
    this.http.get<User>('/api/auth/me').subscribe(user => this._user.set(user));
  }
}
