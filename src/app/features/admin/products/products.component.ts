import { Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CurrencyBrPipe } from '@shared/pipes/currency-br.pipe';

interface Product {
  id: string;
  title: string;
  price: number;
  image: string;
  authorId: string;
  approved: boolean;
}

interface User {
  id: string;
  name: string;
}

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CurrencyBrPipe],
  template: `
    <div class="space-y-6">
      <h1 class="text-2xl font-bold text-foreground">Aprovação de produtos</h1>

      <div class="bg-card border border-border rounded-lg overflow-hidden">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-border bg-muted/50">
              <th class="text-left p-4 text-foreground font-medium">Produto</th>
              <th class="text-left p-4 text-foreground font-medium">Autor</th>
              <th class="text-left p-4 text-foreground font-medium">Preço</th>
              <th class="text-left p-4 text-foreground font-medium">Status</th>
              <th class="text-right p-4 text-foreground font-medium">Ações</th>
            </tr>
          </thead>
          <tbody>
            @for (p of products(); track p.id) {
              <tr class="border-b border-border last:border-0 hover:bg-muted/30 transition">
                <td class="p-4">
                  <div class="flex items-center gap-3">
                    <img [src]="p.image" class="w-12 h-9 object-cover rounded" />
                    <span class="text-foreground font-medium">{{ p.title }}</span>
                  </div>
                </td>
                <td class="p-4 text-muted-foreground">{{ authorMap[p.authorId] || 'Desconhecido' }}</td>
                <td class="p-4 text-foreground">{{ p.price | currencyBr }}</td>
                <td class="p-4">
                  <span class="px-2 py-1 text-xs rounded-full font-medium"
                    [class.bg-primary/10]="p.approved"
                    [class.text-primary]="p.approved"
                    [class.bg-destructive/10]="!p.approved"
                    [class.text-destructive]="!p.approved"
                  >
                    {{ p.approved ? 'Aprovado' : 'Pendente' }}
                  </span>
                </td>
                <td class="p-4 text-right space-x-2">
                  @if (!p.approved) {
                    <button (click)="approve(p)" class="px-3 py-1.5 text-xs font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition">
                      Aprovar
                    </button>
                    <button (click)="reject(p)" class="px-3 py-1.5 text-xs font-medium rounded-lg border border-destructive/30 text-destructive hover:bg-destructive/10 transition">
                      Rejeitar
                    </button>
                  } @else {
                    <button (click)="reject(p)" class="px-3 py-1.5 text-xs font-medium rounded-lg border border-destructive/30 text-destructive hover:bg-destructive/10 transition">
                      Remover
                    </button>
                  }
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
})
export class ProductsComponent {
  private http = inject(HttpClient);
  protected products = signal<Product[]>([]);
  protected authorMap: Record<string, string> = {};

  constructor() {
    this.http.get<Product[]>('/api/products').subscribe(ps => this.products.set(ps));
    this.http.get<User[]>('/api/users').subscribe(us => {
      this.authorMap = Object.fromEntries(us.map(u => [u.id, u.name]));
    });
  }

  protected approve(p: Product) {
    this.http.put(`/api/products/${p.id}`, { ...p, approved: true }).subscribe(() => {
      this.products.update(ps => ps.map(x => x.id === p.id ? { ...x, approved: true } : x));
    });
  }

  protected reject(p: Product) {
    this.http.delete(`/api/products/${p.id}`).subscribe(() => {
      this.products.update(ps => ps.filter(x => x.id !== p.id));
    });
  }
}
