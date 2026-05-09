import { Component } from '@angular/core';

@Component({
  selector: 'app-list',
  standalone: true,
  template: `
    <div class="max-w-7xl mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-8 text-foreground">Marketplace</h1>
      <p class="text-muted-foreground">Listagem de templates em breve</p>
    </div>
  `,
})
export class ListComponent {}
