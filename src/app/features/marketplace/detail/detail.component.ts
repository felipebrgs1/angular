import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="max-w-4xl mx-auto px-4 py-8">
      <a routerLink="/marketplace" class="text-purple-600 hover:underline mb-4 inline-block">&larr; Voltar</a>
      <h1 class="text-3xl font-bold mb-8">Detalhe do produto</h1>
      <p class="text-gray-500">ID: {{ productId }}</p>
    </div>
  `,
})
export class DetailComponent {
  protected productId: string;

  constructor(route: ActivatedRoute) {
    this.productId = route.snapshot.params['id'];
  }
}
