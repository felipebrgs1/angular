import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformServer } from '@angular/common';
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

const COOKIE_EXPIRY_S = 7 * 24 * 60 * 60; // 7 dias

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  private _user = signal<User | null>(null);
  private returnUrl: string | null = null;

  readonly user = this._user.asReadonly();
  readonly isLogged = computed(() => !!this._user());
  readonly isAdmin = computed(() => this._user()?.role === 'admin');

  constructor() {
    this.loadUser();
  }

  private get isBrowser(): boolean {
    return !isPlatformServer(this.platformId);
  }

  private setCookie(name: string, value: string, maxAge: number): void {
    if (!this.isBrowser) return;
    document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax`;
  }

  private getCookie(name: string): string | null {
    if (!this.isBrowser) return null;
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
  }

  private removeCookie(name: string): void {
    this.setCookie(name, '', 0);
  }

  setReturnUrl(url: string) {
    this.returnUrl = url;
  }

  login(credentials: LoginDto) {
    return this.http.post<AuthResponse>('/api/auth/login', credentials).pipe(
      tap(res => {
        this.setCookie('token', res.token, COOKIE_EXPIRY_S);
        this.setCookie('user', JSON.stringify(res.user), COOKIE_EXPIRY_S);
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
        this.setCookie('token', res.token, COOKIE_EXPIRY_S);
        this.setCookie('user', JSON.stringify(res.user), COOKIE_EXPIRY_S);
        this._user.set(res.user);
        this.router.navigateByUrl('/marketplace');
      }),
    );
  }

  logout() {
    this.removeCookie('token');
    this.removeCookie('user');
    this._user.set(null);
    this.router.navigateByUrl('/');
  }

  loadUser() {
    const token = this.getCookie('token');
    if (!token) return;

    const userJson = this.getCookie('user');
    if (userJson) {
      try {
        this._user.set(JSON.parse(userJson));
      } catch {}
    }

    this.http.get<User>('/api/auth/me').subscribe({
      next: (user) => {
        this._user.set(user);
        this.setCookie('user', JSON.stringify(user), COOKIE_EXPIRY_S);
      },
      error: () => {
        this.removeCookie('token');
        this.removeCookie('user');
        this._user.set(null);
      }
    });
  }
}
