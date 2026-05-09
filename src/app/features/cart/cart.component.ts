import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '@core/services/cart.service';
import { CurrencyBrPipe } from '@shared/pipes/currency-br.pipe';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [RouterLink, CurrencyBrPipe],
  template: `
    <div class="min-h-screen relative overflow-hidden">
      <!-- Decorative ambient gradient -->
      <div class="absolute top-0 left-0 w-[50%] h-[25rem] bg-[radial-gradient(circle_at_top_left,_oklch(var(--primary)/0.08),_transparent_70%)] pointer-events-none"></div>

      <div class="relative max-w-6xl mx-auto px-4 pt-28 pb-20 sm:pt-32 animate-in fade-in duration-500">
        <h1 class="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight mb-10 border-b border-border/50 pb-6">
          Seu Carrinho
        </h1>

        @if (cart.items().length === 0) {
          <div class="text-center py-24 px-6 bg-card/40 border border-dashed border-border/80 rounded-3xl max-w-3xl mx-auto flex flex-col items-center">
            <div class="w-24 h-24 bg-muted/40 rounded-full flex items-center justify-center mb-6 text-muted-foreground">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
            </div>
            <h2 class="text-2xl font-bold text-foreground mb-3">Seu carrinho está vazio</h2>
            <p class="text-muted-foreground text-lg mb-8 max-w-md leading-relaxed">
              Parece que você ainda não adicionou nada. Que tal dar uma olhada no nosso marketplace recheado de novidades?
            </p>
            <a routerLink="/marketplace" class="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all transform active:scale-95">
              Explorar Marketplace
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </a>
          </div>
        } @else {
          <div class="grid lg:grid-cols-3 gap-8">
            
            <!-- Item List Section -->
            <div class="lg:col-span-2 space-y-5">
              @for (item of cart.items(); track item.id) {
                <div class="group flex items-center gap-4 sm:gap-6 p-5 bg-card border border-border/60 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:border-border relative">
                  
                  <!-- Product Image -->
                  <div class="w-24 h-20 sm:w-32 sm:h-24 bg-muted rounded-xl overflow-hidden flex-shrink-0 border border-border/40">
                    <img [src]="item.image" [alt]="item.title" class="w-full h-full object-cover transition duration-500 group-hover:scale-105" />
                  </div>

                  <!-- Details -->
                  <div class="flex-1 min-w-0 py-1">
                    <h3 class="font-bold text-lg text-foreground truncate group-hover:text-primary transition-colors">
                      {{ item.title }}
                    </h3>
                    <p class="text-sm font-medium text-muted-foreground mt-1">
                      {{ item.price | currencyBr }} <span class="text-xs">/ uni</span>
                    </p>
                    
                    <!-- Mobile display of subtotal and quantity control can fit here in small screens -->
                    <div class="flex sm:hidden items-center justify-between mt-3">
                        <div class="flex items-center bg-muted/50 border border-border/50 rounded-lg p-0.5">
                          <button (click)="cart.updateQty(item.id, item.qty - 1)" class="w-7 h-7 flex items-center justify-center hover:bg-card rounded-md transition text-muted-foreground hover:text-foreground text-lg font-bold">
                            &minus;
                          </button>
                          <span class="w-7 text-center text-foreground text-sm font-bold">{{ item.qty }}</span>
                          <button (click)="cart.updateQty(item.id, item.qty + 1)" class="w-7 h-7 flex items-center justify-center hover:bg-card rounded-md transition text-muted-foreground hover:text-foreground text-lg font-bold">
                            +
                          </button>
                        </div>
                        <p class="font-extrabold text-foreground text-sm">{{ item.price * item.qty | currencyBr }}</p>
                    </div>
                  </div>

                  <!-- Desktop Actions & Subtotal -->
                  <div class="hidden sm:flex flex-col sm:flex-row items-center gap-6 sm:gap-8 flex-shrink-0">
                    <!-- Quantity Control -->
                    <div class="flex items-center bg-muted/50 border border-border/50 rounded-xl p-1">
                      <button
                        (click)="cart.updateQty(item.id, item.qty - 1)"
                        class="w-8 h-8 flex items-center justify-center rounded-lg bg-transparent text-muted-foreground hover:bg-card hover:text-foreground transition-all active:scale-90 text-lg"
                        aria-label="Reduzir"
                      >
                        &minus;
                      </button>
                      <span class="w-10 text-center text-foreground font-bold tabular-nums">{{ item.qty }}</span>
                      <button
                        (click)="cart.updateQty(item.id, item.qty + 1)"
                        class="w-8 h-8 flex items-center justify-center rounded-lg bg-transparent text-muted-foreground hover:bg-card hover:text-foreground transition-all active:scale-90 text-lg"
                        aria-label="Aumentar"
                      >
                        +
                      </button>
                    </div>

                    <!-- Price Subtotal -->
                    <div class="text-right min-w-[7rem]">
                      <p class="font-extrabold text-xl text-foreground tracking-tight">
                        {{ item.price * item.qty | currencyBr }}
                      </p>
                    </div>

                    <!-- Remove Action -->
                    <button 
                      (click)="cart.remove(item.id)" 
                      class="text-muted-foreground/60 hover:text-destructive hover:bg-destructive/10 transition-all p-2.5 rounded-xl group/trash active:scale-90" 
                      title="Remover item"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="group-hover/trash:scale-110 transition-transform"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                    </button>
                  </div>
                  
                  <!-- Floating delete button for mobile top corner -->
                  <button 
                    (click)="cart.remove(item.id)" 
                    class="sm:hidden absolute -top-2 -right-2 bg-destructive text-destructive-foreground p-1.5 rounded-full shadow-md active:scale-90"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                  </button>
                </div>
              }
              
              <div class="pt-4">
                 <a routerLink="/marketplace" class="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors group">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="group-hover:-translate-x-1 transition-transform"><path d="m15 18-6-6 6-6"/></svg>
                    Adicionar mais itens
                 </a>
              </div>
            </div>

            <!-- Order Summary Sticker Side -->
            <div class="lg:col-span-1">
              <div class="sticky top-28 bg-card border border-border rounded-3xl p-6 shadow-lg shadow-foreground/5 border-t-4 border-t-primary">
                <h3 class="text-xl font-extrabold text-foreground mb-6">Resumo do pedido</h3>
                
                <div class="space-y-4 mb-6">
                  <div class="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span class="font-medium text-foreground">{{ cart.total() | currencyBr }}</span>
                  </div>
                  <div class="flex justify-between text-muted-foreground border-b border-border/50 pb-4">
                    <span>Descontos</span>
                    <span class="font-medium text-green-500">R$ 0,00</span>
                  </div>
                  <div class="flex items-center justify-between pt-2">
                    <span class="text-lg font-bold text-foreground">Total</span>
                    <div class="text-right">
                      <span class="text-3xl font-black text-primary tracking-tighter leading-none">
                        {{ cart.total() | currencyBr }}
                      </span>
                    </div>
                  </div>
                </div>

                <div class="space-y-3">
                  <a routerLink="/checkout" class="w-full flex items-center justify-center gap-2 py-4 px-4 bg-primary text-primary-foreground text-center font-extrabold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-[0.98] text-lg group">
                    Ir para o Checkout
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="group-hover:translate-x-1 transition-transform"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                  </a>
                  <p class="text-center text-xs text-muted-foreground mt-4">
                    🔒 Pagamento 100% seguro e encriptado.
                  </p>
                </div>
              </div>
            </div>

          </div>
        }
      </div>
    </div>
  `,
})
export class CartComponent {
  protected cart = inject(CartService);
}
