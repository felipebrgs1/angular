import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="flex min-h-screen">
      <aside class="w-64 bg-sidebar text-sidebar-foreground p-6">
        <h2 class="text-xl font-bold mb-8">Dashboard</h2>
        <nav class="space-y-2">
          <a routerLink="/dashboard/purchases" routerLinkActive="text-primary" class="block hover:text-primary transition">Minhas compras</a>
          <a routerLink="/dashboard/seller/products" routerLinkActive="text-primary" class="block hover:text-primary transition">Meus produtos</a>
          <a routerLink="/dashboard/seller/sales" routerLinkActive="text-primary" class="block hover:text-primary transition">Vendas</a>
        </nav>
      </aside>
      <main class="flex-1 p-8 bg-background">
        <router-outlet />
      </main>
    </div>
  `,
})
export class DashboardLayoutComponent {}
