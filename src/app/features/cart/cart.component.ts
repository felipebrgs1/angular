import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { CurrencyBrPipe } from '../../shared/pipes/currency-br.pipe';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [RouterLink, CurrencyBrPipe],
  template: `
    <div class="max-w-4xl mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-8 text-foreground">Carrinho</h1>

      @if (cart.items().length === 0) {
        <div class="text-center py-20">
          <p class="text-muted-foreground text-lg mb-4">Seu carrinho está vazio</p>
          <a routerLink="/marketplace" class="text-primary hover:underline">Explorar produtos</a>
        </div>
      } @else {
        <div class="space-y-4">
          @for (item of cart.items(); track item.id) {
            <div class="flex items-center gap-4 p-4 bg-card border border-border rounded-lg">
              <img [src]="item.image" [alt]="item.title" class="w-20 h-16 object-cover rounded-md" />

              <div class="flex-1 min-w-0">
                <h3 class="font-semibold text-foreground truncate">{{ item.title }}</h3>
                <p class="text-sm text-muted-foreground">{{ item.price | currencyBr }}</p>
              </div>

              <div class="flex items-center gap-2">
                <button
                  (click)="cart.updateQty(item.id, item.qty - 1)"
                  class="w-8 h-8 flex items-center justify-center rounded-md border border-border bg-card text-foreground hover:bg-accent transition text-sm"
                >
                  &minus;
                </button>
                <span class="w-8 text-center text-foreground font-medium">{{ item.qty }}</span>
                <button
                  (click)="cart.updateQty(item.id, item.qty + 1)"
                  class="w-8 h-8 flex items-center justify-center rounded-md border border-border bg-card text-foreground hover:bg-accent transition text-sm"
                >
                  +
                </button>
              </div>

              <div class="text-right min-w-[5rem]">
                <p class="font-semibold text-foreground">{{ item.price * item.qty | currencyBr }}</p>
              </div>

              <button (click)="cart.remove(item.id)" class="text-muted-foreground hover:text-destructive transition p-1" aria-label="Remover">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          }
        </div>

        <div class="mt-8 p-6 bg-card border border-border rounded-lg">
          <div class="flex items-center justify-between mb-4">
            <span class="text-lg text-foreground">Total</span>
            <span class="text-2xl font-bold text-primary">{{ cart.total() | currencyBr }}</span>
          </div>
          <div class="flex gap-4">
            <a routerLink="/marketplace" class="flex-1 py-3 text-center border border-border text-foreground font-medium rounded-lg hover:bg-accent transition">
              Continuar comprando
            </a>
            <a routerLink="/checkout" class="flex-1 py-3 text-center bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition">
              Finalizar compra
            </a>
          </div>
        </div>
      }
    </div>
  `,
})
export class CartComponent {
  protected cart = inject(CartService);
}
