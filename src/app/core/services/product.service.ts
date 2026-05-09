import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, shareReplay } from 'rxjs/operators';

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  authorId: string;
  approved: boolean;
  category: string;
  sales?: number;
  rating?: number;
  tags?: string[];
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);

  private all$ = this.http.get<Product[]>('/api/products').pipe(
    map(products => products.filter(p => p.approved)),
    shareReplay(1),
  );

  readonly products = toSignal(this.all$, { initialValue: [] as Product[] });
  readonly loading = signal(true);

  constructor() {
    this.all$.subscribe({
      next: () => this.loading.set(false),
      error: () => this.loading.set(false),
    });
  }

  getById(id: string) {
    return this.http.get<Product>(`/api/products/${id}`);
  }
}
