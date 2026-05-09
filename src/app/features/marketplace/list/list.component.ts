import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductService } from '@core/services/product.service';
import { ProductCardComponent } from '@shared/components/product-card/product-card.component';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [FormsModule, ProductCardComponent],
  template: `
    <div class="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 class="text-3xl font-bold text-foreground">Marketplace</h1>

        <input
          type="text"
          [(ngModel)]="search"
          placeholder="Buscar templates..."
          class="w-full sm:w-72 px-3 py-2 border border-border rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:border-ring outline-none transition"
        />
      </div>

      <div class="flex gap-2 flex-wrap">
        @for (cat of categories(); track cat) {
          <button
            (click)="selectedCategory.set(cat)"
            class="px-3 py-1.5 text-sm rounded-full border transition font-medium"
            [class.bg-primary]="selectedCategory() === cat"
            [class.text-primary-foreground]="selectedCategory() === cat"
            [class.border-primary]="selectedCategory() === cat"
            [class.border-border]="selectedCategory() !== cat"
            [class.text-muted-foreground]="selectedCategory() !== cat"
            [class.hover:bg-accent]="selectedCategory() !== cat"
          >
            {{ cat }}
          </button>
        }
      </div>

      @if (loading()) {
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (_ of [1,2,3,4,5,6]; track _) {
            <div class="border border-border rounded-xl overflow-hidden bg-card animate-pulse">
              <div class="aspect-[4/3] bg-muted"></div>
              <div class="p-4 space-y-3">
                <div class="h-5 bg-muted rounded w-3/4"></div>
                <div class="h-4 bg-muted rounded w-full"></div>
                <div class="h-4 bg-muted rounded w-1/2"></div>
                <div class="h-6 bg-muted rounded w-1/3"></div>
              </div>
            </div>
          }
        </div>
      } @else {
        @if (filtered().length === 0) {
          <div class="text-center py-20">
            <p class="text-muted-foreground text-lg">Nenhum template encontrado.</p>
          </div>
        } @else {
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            @for (product of filtered(); track product.id) {
              <app-product-card
                [id]="product.id"
                [title]="product.title"
                [description]="product.description"
                [price]="product.price"
                [image]="product.image"
                [sales]="product.sales ?? 0"
              />
            }
          </div>
        }
      }
    </div>
  `,
})
export class ListComponent {
  private productService = inject(ProductService);

  protected readonly products = this.productService.products;
  protected readonly loading = this.productService.loading;
  protected readonly search = signal('');
  protected readonly selectedCategory = signal('Todos');

  protected readonly categories = computed(() => {
    const cats = [...new Set(this.products().map(p => p.category))];
    return ['Todos', ...cats];
  });

  protected readonly filtered = computed(() => {
    const query = this.search().toLowerCase().trim();
    const cat = this.selectedCategory();

    return this.products().filter(p => {
      const matchSearch = !query || p.title.toLowerCase().includes(query) || p.description.toLowerCase().includes(query);
      const matchCategory = cat === 'Todos' || p.category === cat;
      return matchSearch && matchCategory;
    });
  });
}
