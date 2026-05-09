import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductService } from '@core/services/product.service';
import { ProductCardComponent } from '@shared/components/product-card/product-card.component';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [FormsModule, ProductCardComponent],
  template: `
    <div class="min-h-screen relative overflow-hidden">
      <!-- Modern background gradient accent -->
      <div class="absolute top-0 right-0 w-[60%] h-[30rem] bg-[radial-gradient(circle_at_top_right,_oklch(var(--primary)/0.12),_transparent_70%)] pointer-events-none"></div>

      <div class="relative max-w-7xl mx-auto px-4 pt-28 pb-16 sm:pt-32 space-y-10">
        <!-- Header Section -->
        <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-b border-border/50 pb-8">
          <div class="space-y-2">
            <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">Marketplace</h1>
            <p class="text-muted-foreground text-lg max-w-lg">Explore nossa coleção curada de componentes premium.</p>
          </div>

          <div class="relative group w-full md:w-80">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input
              type="text"
              [(ngModel)]="search"
              placeholder="Buscar templates..."
              class="w-full pl-10 pr-4 py-3 bg-card border border-border/60 rounded-xl text-foreground placeholder:text-muted-foreground/70 shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
            />
          </div>
        </div>

        <!-- Categories Filters -->
        <div class="flex gap-2 flex-wrap items-center">
          <span class="text-sm font-medium text-muted-foreground mr-2">Filtrar por:</span>
          @for (cat of categories(); track cat) {
            <button
              (click)="selectedCategory.set(cat)"
              class="px-4 py-2 text-sm rounded-full border font-medium transition-all active:scale-95 duration-200"
              [class.bg-primary]="selectedCategory() === cat"
              [class.text-primary-foreground]="selectedCategory() === cat"
              [class.border-primary]="selectedCategory() === cat"
              [class.shadow-md]="selectedCategory() === cat"
              [class.shadow-primary/20]="selectedCategory() === cat"
              [class.bg-card]="selectedCategory() !== cat"
              [class.border-border/80]="selectedCategory() !== cat"
              [class.text-muted-foreground]="selectedCategory() !== cat"
              [class.hover:bg-accent]="selectedCategory() !== cat"
              [class.hover:text-foreground]="selectedCategory() !== cat"
            >
              {{ cat }}
            </button>
          }
        </div>

        <!-- Content Section -->
        <div>
          @if (loading()) {
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
              @for (_ of [1,2,3,4,5,6]; track _) {
                <div class="border border-border/60 rounded-2xl overflow-hidden bg-card shadow-sm">
                  <div class="aspect-[16/10] bg-muted animate-pulse"></div>
                  <div class="p-5 space-y-4">
                    <div class="h-5 bg-muted animate-pulse rounded-md w-2/3"></div>
                    <div class="space-y-2">
                      <div class="h-4 bg-muted animate-pulse rounded-md w-full"></div>
                      <div class="h-4 bg-muted animate-pulse rounded-md w-4/5"></div>
                    </div>
                    <div class="h-8 pt-4 border-t border-border/50 flex justify-between items-center">
                      <div class="h-6 bg-muted animate-pulse rounded-md w-1/3"></div>
                      <div class="h-4 bg-muted animate-pulse rounded-md w-1/4"></div>
                    </div>
                  </div>
                </div>
              }
            </div>
          } @else {
            <div class="animate-in fade-in slide-in-from-bottom-4 duration-500">
              @if (filtered().length === 0) {
                <div class="text-center py-32 bg-card/30 border border-dashed border-border/80 rounded-3xl">
                  <div class="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4 text-muted-foreground">
                     <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/><path d="M8 8l6 6"/><path d="M14 8l-6 6"/></svg>
                  </div>
                  <h3 class="text-xl font-bold text-foreground mb-2">Nada encontrado</h3>
                  <p class="text-muted-foreground">Não encontramos templates correspondentes à sua busca.</p>
                  <button (click)="search.set(''); selectedCategory.set('Todos')" class="mt-6 text-primary font-medium hover:underline">Limpar filtros</button>
                </div>
              } @else {
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
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
            </div>
          }
        </div>
      </div>
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
