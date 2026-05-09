import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { AuthService } from './auth.service';

function mockLocalStorage() {
  let store: Record<string, string> = {};
  Object.defineProperty(globalThis, 'localStorage', {
    value: {
      getItem: (k: string) => store[k] ?? null,
      setItem: (k: string, v: string) => { store[k] = v; },
      removeItem: (k: string) => { delete store[k]; },
      clear: () => { store = {}; },
    },
    configurable: true,
  });
  return () => { store = {}; };
}

describe('AuthService', () => {
  let service: AuthService;
  let http: HttpTestingController;
  let clear: () => void;

  beforeEach(() => {
    clear = mockLocalStorage();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    });
    service = TestBed.inject(AuthService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('starts logged out', () => {
    expect(service.isLogged()).toBe(false);
    expect(service.user()).toBeNull();
  });

  it('login sets user and token', () => {
    let resolved = false;
    service.login({ email: 'a@b.com', password: '123456' }).subscribe(() => (resolved = true));

    const req = http.expectOne('/api/auth/login');
    req.flush({ token: 'abc', user: { id: '1', name: 'Test', email: 'a@b.com', role: 'buyer' } });

    expect(resolved).toBe(true);
    expect(service.isLogged()).toBe(true);
    expect(service.user()?.name).toBe('Test');
    expect(localStorage.getItem('token')).toBe('abc');
  });

  it('login with invalid credentials fails', () => {
    let error: unknown;
    service.login({ email: 'x@y.com', password: 'wrong' }).subscribe({ error: (e) => (error = e) });

    http.expectOne('/api/auth/login').flush({ message: 'Invalid' }, { status: 401, statusText: 'Unauthorized' });

    expect(error).toBeTruthy();
    expect(service.isLogged()).toBe(false);
  });

  it('logout clears user and token', () => {
    localStorage.setItem('token', 'abc');
    service.login({ email: 'a@b.com', password: '123456' }).subscribe();
    http.expectOne('/api/auth/login').flush({ token: 'abc', user: { id: '1', name: 'T', email: 'a@b.com', role: 'buyer' } });

    service.logout();

    expect(service.isLogged()).toBe(false);
    expect(service.user()).toBeNull();
    expect(localStorage.getItem('token')).toBeNull();
  });

  it('register creates user and logs in', () => {
    let resolved = false;
    service.register({ name: 'New', email: 'new@b.com', password: '123456' }).subscribe(() => (resolved = true));

    const req = http.expectOne('/api/auth/register');
    req.flush({ token: 'xyz', user: { id: '2', name: 'New', email: 'new@b.com', role: 'buyer' } });

    expect(resolved).toBe(true);
    expect(service.isLogged()).toBe(true);
    expect(service.user()?.name).toBe('New');
  });

  it('detects admin role', () => {
    service.login({ email: 'admin@x.com', password: 'x' }).subscribe();
    http.expectOne('/api/auth/login').flush({ token: 't', user: { id: '1', name: 'Admin', email: 'admin@x.com', role: 'admin' } });

    expect(service.isAdmin()).toBe(true);
  });

  it('detects non-admin role', () => {
    service.login({ email: 'u@x.com', password: 'x' }).subscribe();
    http.expectOne('/api/auth/login').flush({ token: 't', user: { id: '2', name: 'User', email: 'u@x.com', role: 'buyer' } });

    expect(service.isAdmin()).toBe(false);
  });
});
