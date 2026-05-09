import { Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { CurrencyBrPipe } from '@shared/pipes/currency-br.pipe';
import { RouterLink } from '@angular/router';

interface Purchase {
  id: string;
  productId: string;
  qty: number;
  total: number;
  date: string;
  status: string;
}

interface Product {
  id: string;
  title: string;
  image: string;
}

@Component({
  selector: 'app-purchases',
  standalone: true,
  imports: [CurrencyBrPipe, RouterLink, DatePipe],
  template: `
    <div class="space-y-6">
      <h1 class="text-2xl font-bold text-foreground">Minhas compras</h1>

      @if (loading()) {
        <div class="space-y-4">
          @for (_ of [1,2,3]; track _) {
            <div class="h-24 bg-muted rounded-lg animate-pulse"></div>
          }
        </div>
      } @else if (purchases().length === 0) {
        <div class="text-center py-16">
          <p class="text-muted-foreground mb-4">Você ainda não fez nenhuma compra.</p>
          <a routerLink="/marketplace" class="text-primary hover:underline">Explorar produtos</a>
        </div>
      } @else {
        <div class="space-y-4">
          @for (p of purchases(); track p.id) {
            <div class="flex items-center gap-4 p-4 bg-card border border-border rounded-lg">
              <img [src]="productMap[p.productId]?.image" class="w-16 h-12 object-cover rounded" />
              <div class="flex-1">
                <p class="font-medium text-foreground">{{ productMap[p.productId]?.title || 'Produto' }}</p>
                <p class="text-sm text-muted-foreground">{{ p.qty }}x {{ (p.total / p.qty) | currencyBr }}</p>
              </div>
              <div class="text-right">
                <p class="font-semibold text-foreground">{{ p.total | currencyBr }}</p>
                <p class="text-xs text-muted-foreground">{{ p.date | date:'shortDate' }}</p>
              </div>
              <span class="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary font-medium">{{ p.status }}</span>
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class PurchasesComponent {
  private http = inject(HttpClient);
  protected loading = signal(true);

  private purchases$ = this.http.get<Purchase[]>('/api/purchases?userId=3');
  private products$ = this.http.get<Product[]>('/api/products');

  protected purchases = toSignal(this.purchases$, { initialValue: [] });
  protected products = toSignal(this.products$, { initialValue: [] });

  protected productMap: Record<string, Product> = {};

  constructor() {
    this.products$.subscribe(ps => {
      this.productMap = Object.fromEntries(ps.map(p => [p.id, p]));
    });
    this.purchases$.subscribe({
      next: () => this.loading.set(false),
      error: () => this.loading.set(false),
    });
  }
}
