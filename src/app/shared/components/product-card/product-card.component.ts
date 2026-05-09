import { Component } from '@angular/core';

@Component({
  selector: 'app-product-card',
  standalone: true,
  template: `
    <div class="border border-border rounded-xl p-4 hover:shadow-lg transition bg-card">
      <p class="text-muted-foreground">ProductCard em breve</p>
    </div>
  `,
})
export class ProductCardComponent {}
