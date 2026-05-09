import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="flex min-h-screen">
      <aside class="w-64 bg-gray-900 text-white p-6">
        <h2 class="text-xl font-bold mb-8">Dashboard</h2>
        <nav class="space-y-2">
          <a routerLink="/dashboard/purchases" routerLinkActive="text-purple-400" class="block hover:text-purple-400 transition">Minhas compras</a>
          <a routerLink="/dashboard/seller/products" routerLinkActive="text-purple-400" class="block hover:text-purple-400 transition">Meus produtos</a>
          <a routerLink="/dashboard/seller/sales" routerLinkActive="text-purple-400" class="block hover:text-purple-400 transition">Vendas</a>
        </nav>
      </aside>
      <main class="flex-1 p-8">
        <router-outlet />
      </main>
    </div>
  `,
})
export class DashboardLayoutComponent {}
