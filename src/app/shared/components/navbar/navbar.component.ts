import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { CartService } from '@core/services/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="bg-card border-b border-border sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <a routerLink="/" class="text-xl font-bold text-foreground">UI Templates</a>

        <div class="flex items-center gap-6">
          <a routerLink="/marketplace" routerLinkActive="text-primary" class="text-muted-foreground hover:text-foreground transition">Marketplace</a>

          <a routerLink="/cart" routerLinkActive="text-primary" class="text-muted-foreground hover:text-foreground transition relative">
            Carrinho
            @if (cartCount() > 0) {
              <span class="absolute -top-2 -right-4 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {{ cartCount() }}
              </span>
            }
          </a>

          @if (auth.isLogged()) {
            <div class="flex items-center gap-3">
              <span class="text-sm text-muted-foreground">{{ auth.user()?.name }}</span>
              <button (click)="auth.logout()" class="text-sm text-muted-foreground hover:text-destructive transition">
                Sair
              </button>
            </div>
          } @else {
            <a routerLink="/auth/login" class="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition text-sm font-medium">
              Entrar
            </a>
          }
        </div>
      </div>
    </nav>
  `,
})
export class NavbarComponent {
  protected auth = inject(AuthService);
  protected cartCount = inject(CartService).count;
}
