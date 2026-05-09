import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="max-w-4xl mx-auto px-4 py-8">
      <a routerLink="/marketplace" class="text-primary hover:underline mb-4 inline-block">&larr; Voltar</a>
      <h1 class="text-3xl font-bold mb-8 text-foreground">Detalhe do produto</h1>
      <p class="text-muted-foreground">ID: {{ productId }}</p>
    </div>
  `,
})
export class DetailComponent {
  protected productId: string;

  constructor(route: ActivatedRoute) {
    this.productId = route.snapshot.params['id'];
  }
}
