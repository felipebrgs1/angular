import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="max-w-4xl mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-8">Carrinho</h1>
      <p class="text-gray-500">Seu carrinho está vazio</p>
      <a routerLink="/marketplace" class="text-purple-600 hover:underline mt-4 inline-block">Explorar produtos</a>
    </div>
  `,
})
export class CartComponent {}
