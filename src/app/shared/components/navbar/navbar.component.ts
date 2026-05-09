import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <a routerLink="/" class="text-xl font-bold text-gray-900">UI Templates</a>
        <div class="flex items-center gap-6">
          <a routerLink="/marketplace" routerLinkActive="text-purple-600" class="text-gray-600 hover:text-gray-900 transition">Marketplace</a>
          <a routerLink="/cart" routerLinkActive="text-purple-600" class="text-gray-600 hover:text-gray-900 transition relative">
            Carrinho
          </a>
          <a routerLink="/auth/login" class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm font-medium">
            Entrar
          </a>
        </div>
      </div>
    </nav>
  `,
})
export class NavbarComponent {}
