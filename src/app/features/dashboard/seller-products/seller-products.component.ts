import { Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CurrencyBrPipe } from '@shared/pipes/currency-br.pipe';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
  approved: boolean;
}

@Component({
  selector: 'app-seller-products',
  standalone: true,
  imports: [ReactiveFormsModule, CurrencyBrPipe],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold text-foreground">Meus produtos</h1>
        <button (click)="showForm.set(true); form.reset()" class="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition">
          Novo produto
        </button>
      </div>

      @if (showForm()) {
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="bg-card border border-border rounded-lg p-6 space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div class="col-span-2">
              <label class="block text-sm font-medium text-foreground/80 mb-1">Título</label>
              <input type="text" formControlName="title" class="w-full px-3 py-2 border border-border rounded-lg bg-card text-foreground focus:ring-2 focus:ring-ring outline-none transition" />
            </div>
            <div class="col-span-2">
              <label class="block text-sm font-medium text-foreground/80 mb-1">Descrição</label>
              <textarea formControlName="description" rows="3" class="w-full px-3 py-2 border border-border rounded-lg bg-card text-foreground focus:ring-2 focus:ring-ring outline-none transition resize-none"></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-foreground/80 mb-1">Preço</label>
              <input type="number" step="0.01" formControlName="price" class="w-full px-3 py-2 border border-border rounded-lg bg-card text-foreground focus:ring-2 focus:ring-ring outline-none transition" />
            </div>
            <div>
              <label class="block text-sm font-medium text-foreground/80 mb-1">Categoria</label>
              <select formControlName="category" class="w-full px-3 py-2 border border-border rounded-lg bg-card text-foreground focus:ring-2 focus:ring-ring outline-none transition">
                <option value="Dashboards">Dashboards</option>
                <option value="Landing Pages">Landing Pages</option>
                <option value="Kits">Kits</option>
              </select>
            </div>
            <div class="col-span-2">
              <label class="block text-sm font-medium text-foreground/80 mb-1">URL da imagem</label>
              <input type="text" formControlName="image" class="w-full px-3 py-2 border border-border rounded-lg bg-card text-foreground focus:ring-2 focus:ring-ring outline-none transition" />
            </div>
          </div>
          <div class="flex gap-3">
            <button type="submit" [disabled]="form.invalid" class="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 disabled:opacity-50 transition">
              {{ editingId() ? 'Atualizar' : 'Criar' }}
            </button>
            <button type="button" (click)="showForm.set(false)" class="px-4 py-2 border border-border text-foreground text-sm font-medium rounded-lg hover:bg-accent transition">
              Cancelar
            </button>
          </div>
        </form>
      }

      @if (products().length === 0) {
        <div class="text-center py-16">
          <p class="text-muted-foreground">Nenhum produto cadastrado.</p>
        </div>
      } @else {
        <div class="space-y-3">
          @for (p of products(); track p.id) {
            <div class="flex items-center gap-4 p-4 bg-card border border-border rounded-lg">
              <img [src]="p.image" class="w-16 h-12 object-cover rounded" />
              <div class="flex-1 min-w-0">
                <p class="font-medium text-foreground truncate">{{ p.title }}</p>
                <p class="text-sm text-muted-foreground">{{ p.category }} — {{ p.price | currencyBr }}</p>
              </div>
              <span class="px-2 py-1 text-xs rounded-full font-medium"
                [class.bg-primary/10]="p.approved"
                [class.text-primary]="p.approved"
                [class.bg-destructive/10]="!p.approved"
                [class.text-destructive]="!p.approved"
              >
                {{ p.approved ? 'Aprovado' : 'Pendente' }}
              </span>
              <button (click)="edit(p)" class="text-sm text-muted-foreground hover:text-foreground transition">Editar</button>
              <button (click)="remove(p.id)" class="text-sm text-muted-foreground hover:text-destructive transition">Remover</button>
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class SellerProductsComponent {
  private http = inject(HttpClient);
  private fb = inject(FormBuilder);

  protected showForm = signal(false);
  protected editingId = signal<string | null>(null);
  protected products = signal<Product[]>([]);

  protected form = this.fb.nonNullable.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0.01)]],
    image: ['', Validators.required],
    category: ['Dashboards', Validators.required],
  });

  constructor() {
    this.http.get<Product[]>('/api/products?authorId=2').subscribe(ps => this.products.set(ps));
  }

  protected edit(p: Product) {
    this.editingId.set(p.id);
    this.form.patchValue(p);
    this.showForm.set(true);
  }

  protected onSubmit() {
    if (this.form.invalid) return;
    const data = { ...this.form.getRawValue(), authorId: '2', approved: false };

    if (this.editingId()) {
      this.http.put(`/api/products/${this.editingId()}`, data).subscribe(() => {
        this.products.update(ps => ps.map(p => p.id === this.editingId() ? { ...p, ...data } : p));
        this.showForm.set(false);
        this.editingId.set(null);
      });
    } else {
      this.http.post<Product>('/api/products', data).subscribe(newP => {
        this.products.update(ps => [...ps, newP]);
        this.showForm.set(false);
      });
    }
  }

  protected remove(id: string) {
    this.http.delete(`/api/products/${id}`).subscribe(() => {
      this.products.update(ps => ps.filter(p => p.id !== id));
    });
  }
}
