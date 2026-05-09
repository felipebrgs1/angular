import { Component } from '@angular/core';

@Component({
  selector: 'app-product-card',
  standalone: true,
  template: `
    <div class="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition">
      <p class="text-gray-500">ProductCard em breve</p>
    </div>
  `,
})
export class ProductCardComponent {}
