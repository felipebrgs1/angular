import { Component } from '@angular/core';

@Component({
  selector: 'app-seller-products',
  standalone: true,
  template: `
    <h1 class="text-2xl font-bold mb-6">Meus produtos</h1>
    <p class="text-gray-500">Nenhum produto cadastrado.</p>
  `,
})
export class SellerProductsComponent {}
