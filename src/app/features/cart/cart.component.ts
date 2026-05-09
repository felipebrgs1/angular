import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="max-w-4xl mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-8 text-foreground">Carrinho</h1>
      <p class="text-muted-foreground">Seu carrinho está vazio</p>
      <a routerLink="/marketplace" class="text-primary hover:underline mt-4 inline-block">Explorar produtos</a>
    </div>
  `,
})
export class CartComponent {}
