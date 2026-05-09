import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, switchMap, shareReplay, tap } from 'rxjs/operators';
import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';
import { NotificationService } from '../../../core/services/notification.service';
import { CurrencyBrPipe } from '../../../shared/pipes/currency-br.pipe';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [RouterLink, CurrencyBrPipe],
  template: `
    <div class="max-w-5xl mx-auto px-4 py-8">
      <a routerLink="/marketplace" class="text-primary hover:underline mb-6 inline-block">&larr; Voltar</a>

      @if (loading()) {
        <div class="flex gap-8 animate-pulse">
          <div class="w-full md:w-1/2 aspect-[4/3] bg-muted rounded-xl"></div>
          <div class="flex-1 space-y-4">
            <div class="h-8 bg-muted rounded w-3/4"></div>
            <div class="h-4 bg-muted rounded w-full"></div>
            <div class="h-4 bg-muted rounded w-2/3"></div>
            <div class="h-4 bg-muted rounded w-1/2"></div>
            <div class="h-10 bg-muted rounded w-1/3 mt-8"></div>
          </div>
        </div>
      } @else if (product(); as p) {
        <div class="flex flex-col md:flex-row gap-8">
          <div class="w-full md:w-1/2">
            <img [src]="p.image" [alt]="p.title" class="w-full rounded-xl border border-border" />
          </div>

          <div class="flex-1 space-y-4">
            <h1 class="text-3xl font-bold text-foreground">{{ p.title }}</h1>

            <div class="flex items-center gap-1 text-amber-400">
              @for (star of [1,2,3,4,5]; track star) {
                <svg class="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              }
              @if (p.rating) {
                <span class="text-sm text-muted-foreground ml-1">({{ p.rating }})</span>
              }
            </div>

            <p class="text-muted-foreground leading-relaxed">{{ p.description }}</p>

            @if (p.tags?.length) {
              <div class="flex gap-2 flex-wrap">
                @for (tag of p.tags; track tag) {
                  <span class="px-2 py-1 text-xs rounded-full bg-secondary text-secondary-foreground">{{ tag }}</span>
                }
              </div>
            }

            <div class="text-3xl font-bold text-primary pt-4">{{ p.price | currencyBr }}</div>

            @if (p.sales) {
              <p class="text-sm text-muted-foreground">{{ p.sales }} vendidos</p>
            }

            <button
              (click)="addToCart(p)"
              class="px-6 py-3 font-semibold rounded-lg transition"
              [class.bg-primary]="!added()"
              [class.text-primary-foreground]="!added()"
              [class.hover:bg-primary/90]="!added()"
              [class.bg-secondary]="added()"
              [class.text-secondary-foreground]="added()"
            >
              {{ added() ? 'Adicionado ao carrinho' : 'Adicionar ao carrinho' }}
            </button>
          </div>
        </div>
      } @else {
        <div class="text-center py-20">
          <p class="text-muted-foreground text-lg">Produto não encontrado.</p>
          <a routerLink="/marketplace" class="text-primary hover:underline mt-2 inline-block">Ver todos os produtos</a>
        </div>
      }
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
