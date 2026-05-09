import { Component } from '@angular/core';

@Component({
  selector: 'app-purchases',
  standalone: true,
  template: `
    <h1 class="text-2xl font-bold mb-6">Minhas compras</h1>
    <p class="text-gray-500">Você ainda não fez nenhuma compra.</p>
  `,
})
export class PurchasesComponent {}
