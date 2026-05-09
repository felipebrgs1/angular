import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { CartService } from '@core/services/cart.service';
import { ThemeService } from '@core/services/theme.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="fixed top-0 z-50 w-full px-4 pt-4 pointer-events-none">
      <div class="max-w-7xl mx-auto h-16 flex items-center justify-between px-6 bg-background/80 backdrop-blur-xl border border-border/50 rounded-2xl shadow-lg shadow-foreground/5 pointer-events-auto transition-all duration-300">
        <a routerLink="/" class="text-xl font-bold text-foreground">UI Templates</a>

        <div class="flex items-center gap-6">
          <a routerLink="/marketplace" #rlMkt="routerLinkActive" routerLinkActive
            [class]="'text-sm font-medium transition rounded-full px-3 py-1.5 ' + (rlMkt.isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted')">Marketplace</a>

          <a routerLink="/cart" #rlCart="routerLinkActive" routerLinkActive
            [class]="'relative text-sm font-medium transition rounded-full px-3 py-1.5 ' + (rlCart.isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted')">
            Carrinho
            @if (cartCount() > 0) {
              <span class="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                {{ cartCount() }}
              </span>
            }
          </a>

          @if (auth.isLogged()) {
            <div class="flex items-center gap-3">
              <a routerLink="/dashboard" #rlDash="routerLinkActive" routerLinkActive
                [class]="'text-sm font-medium transition rounded-full px-3 py-1.5 ' + (rlDash.isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted')">Dashboard</a>

              @if (auth.isAdmin()) {
                <a routerLink="/admin" #rla="routerLinkActive" routerLinkActive
                  [class]="'text-sm font-medium transition rounded-full px-3 py-1.5 ' + (rla.isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted')">Admin</a>
              }

              <span class="text-sm text-muted-foreground font-medium">Olá, {{ auth.user()?.name }}</span>
              <button (click)="auth.logout()" class="text-sm text-muted-foreground hover:text-destructive transition">
                Sair
              </button>
            </div>
          } @else {
            <a routerLink="/auth/login" class="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition text-sm font-medium">
              Entrar
            </a>
          }

          <button (click)="themeService.toggle()" class="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition" [title]="themeService.theme() === 'dark' ? 'Modo claro' : 'Modo escuro'">
            @if (themeService.theme() === 'light') {
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
            } @else {
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            }
          </button>
        </div>
      </div>
    </nav>
  `,
})
export class NavbarComponent {
  protected auth = inject(AuthService);
  protected cartCount = inject(CartService).count;
  protected themeService = inject(ThemeService);
}
