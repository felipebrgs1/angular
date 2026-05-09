import { Component } from '@angular/core';

@Component({
  selector: 'app-seller-sales',
  standalone: true,
  template: `
    <h1 class="text-2xl font-bold mb-6 text-foreground">Vendas</h1>
    <p class="text-muted-foreground">Nenhuma venda realizada.</p>
  `,
})
export class SellerSalesComponent {}
