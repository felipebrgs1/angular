import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, switchMap, shareReplay, tap } from 'rxjs/operators';
import { ProductService } from '@core/services/product.service';
import { CartService } from '@core/services/cart.service';
import { NotificationService } from '@core/services/notification.service';
import { CurrencyBrPipe } from '@shared/pipes/currency-br.pipe';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [RouterLink, CurrencyBrPipe],
  template: `
    <div class="min-h-screen relative overflow-hidden bg-background">
      <!-- Sophisticated background accent -->
      <div class="absolute top-0 right-0 w-[50%] h-[35rem] bg-[radial-gradient(circle_at_top_right,_oklch(var(--primary)/0.08),_transparent_70%)] pointer-events-none"></div>

      <div class="relative max-w-6xl mx-auto px-4 pt-28 pb-20 sm:pt-32 animate-in fade-in duration-500">
        
        <!-- Enhanced Back Button -->
        <a routerLink="/marketplace" class="group inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground mb-8 px-4 py-2 bg-card/40 hover:bg-card border border-border/50 rounded-xl transition-all shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="group-hover:-translate-x-1 transition-transform"><path d="m15 18-6-6 6-6"/></svg>
          Voltar para o Marketplace
        </a>

        @if (loading()) {
          <div class="flex flex-col md:flex-row gap-12 animate-pulse">
            <div class="w-full md:w-3/5 aspect-[16/10] bg-muted rounded-3xl"></div>
            <div class="flex-1 space-y-6 py-4">
              <div class="h-10 bg-muted rounded-xl w-3/4"></div>
              <div class="h-5 bg-muted rounded-xl w-1/4"></div>
              <div class="space-y-3 pt-4">
                <div class="h-4 bg-muted rounded-md w-full"></div>
                <div class="h-4 bg-muted rounded-md w-full"></div>
                <div class="h-4 bg-muted rounded-md w-2/3"></div>
              </div>
              <div class="h-12 bg-muted rounded-xl w-1/3 mt-10"></div>
              <div class="h-16 bg-muted rounded-2xl w-full mt-6"></div>
            </div>
          </div>
        } @else if (product(); as p) {
          <div class="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">
            
            <!-- Big Image Stage -->
            <div class="w-full lg:w-3/5 group relative">
              <div class="absolute inset-0 bg-primary/5 rounded-[2.5rem] transform rotate-2 scale-105 group-hover:rotate-1 transition-transform duration-700 -z-10"></div>
              <div class="relative aspect-[16/10] rounded-3xl overflow-hidden bg-muted border border-border shadow-2xl shadow-foreground/5">
                <img [src]="p.image" [alt]="p.title" class="w-full h-full object-cover group-hover:scale-105 transition duration-700 ease-out" />
                
                <!-- Hover overlay to show zoom state hint or just keep visual depth -->
                <div class="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-3xl pointer-events-none"></div>
              </div>
            </div>

            <!-- Info / Buy Block -->
            <div class="flex-1 w-full space-y-8 pt-2">
              <div class="space-y-4">
                <!-- Rating & Stats -->
                <div class="flex items-center gap-3 flex-wrap">
                  <div class="flex items-center gap-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2 py-1 rounded-lg">
                    @for (star of [1,2,3,4,5]; track star) {
                      <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" /></svg>
                    }
                    @if (p.rating) {
                      <span class="text-sm font-bold ml-1">{{ p.rating }}</span>
                    }
                  </div>
                  @if (p.sales) {
                    <div class="px-2.5 py-1 rounded-lg bg-accent/50 text-accent-foreground text-xs font-bold uppercase tracking-wide border border-accent/40">
                      🔥 {{ p.sales }} vendas
                    </div>
                  }
                </div>

                <h1 class="text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight leading-[1.1]">
                  {{ p.title }}
                </h1>
              </div>

              <p class="text-lg text-muted-foreground leading-relaxed font-medium">
                {{ p.description }}
              </p>

              @if (p.tags?.length) {
                <div class="flex gap-2 flex-wrap">
                  @for (tag of p.tags; track tag) {
                    <span class="px-3 py-1.5 text-xs font-bold tracking-wide uppercase rounded-lg bg-muted text-muted-foreground border border-border/60">
                      {{ tag }}
                    </span>
                  }
                </div>
              }

              <!-- Divider -->
              <div class="w-full h-px bg-gradient-to-r from-border to-transparent"></div>

              <!-- Price & Action Card -->
              <div class="bg-card border border-border rounded-3xl p-6 shadow-xl shadow-foreground/5 relative overflow-hidden">
                 <!-- Glowing spot background in the card -->
                 <div class="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 blur-2xl rounded-full"></div>

                 <div class="flex flex-col space-y-6 relative">
                    <div>
                       <span class="text-sm font-bold text-muted-foreground/70 uppercase tracking-widest block mb-1">Licença Vitalícia</span>
                       <div class="text-4xl lg:text-5xl font-black text-foreground tracking-tighter">
                          {{ p.price | currencyBr }}
                       </div>
                    </div>

                    <button
                      (click)="addToCart(p)"
                      [disabled]="added()"
                      class="w-full flex items-center justify-center gap-3 py-4 px-6 font-extrabold rounded-2xl shadow-lg transition-all active:scale-[0.98] text-lg"
                      [class.bg-primary]="!added()"
                      [class.text-primary-foreground]="!added()"
                      [class.shadow-primary/25]="!added()"
                      [class.hover:bg-primary/90]="!added()"
                      [class.bg-green-500]="added()"
                      [class.text-white]="added()"
                      [class.shadow-green-500/20]="added()"
                    >
                      @if (added()) {
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="animate-in zoom-in duration-300"><polyline points="20 6 9 17 4 12"/></svg>
                        Adicionado!
                      } @else {
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
                        Adicionar ao carrinho
                      }
                    </button>
                    
                    <!-- Features bullets short list inside card -->
                    <div class="grid grid-cols-2 gap-x-4 gap-y-2 pt-2">
                        <div class="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
                            Acesso instantâneo
                        </div>
                        <div class="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
                            Updates gratuitos
                        </div>
                    </div>
                 </div>
              </div>

            </div>
          </div>
        } @else {
          <div class="text-center py-32 bg-card/40 border border-dashed border-border/80 rounded-3xl max-w-2xl mx-auto">
            <h3 class="text-2xl font-extrabold text-foreground mb-2">Produto não encontrado</h3>
            <p class="text-muted-foreground mb-6">Pode ser que este item tenha sido removido ou o ID está incorreto.</p>
            <a routerLink="/marketplace" class="px-6 py-3 bg-primary text-primary-foreground font-bold rounded-xl shadow-md hover:bg-primary/90 transition">
              Voltar ao Marketplace
            </a>
          </div>
        }
      </div>
    </div>
  `,
})
export class DetailComponent {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private notif = inject(NotificationService);

  protected loading = signal(true);
  protected added = signal(false);

  private product$ = this.route.params.pipe(
    map(params => params['id']),
    switchMap(id => this.productService.getById(id)),
    tap(() => this.loading.set(false)),
    shareReplay(1),
  );

  protected product = toSignal(this.product$, { initialValue: null });

  protected addToCart(p: NonNullable<ReturnType<typeof this.product>>) {
    this.cartService.add({ id: p.id, title: p.title, price: p.price, image: p.image });
    this.added.set(true);
    this.notif.success('Adicionado ao carrinho!');
    setTimeout(() => this.added.set(false), 2000);
  }
}
