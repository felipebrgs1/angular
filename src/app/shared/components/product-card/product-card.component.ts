import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyBrPipe } from '@shared/pipes/currency-br.pipe';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [RouterLink, CurrencyBrPipe],
  template: `
    <a [routerLink]="'/marketplace/' + id()" 
       class="group block h-full bg-card border border-border/60 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 hover:-translate-y-1 focus:ring-2 focus:ring-primary/40 outline-none">
      
      <!-- Image Container with aspect ratio and internal overlay -->
      <div class="relative aspect-[16/10] bg-muted/50 overflow-hidden">
        <!-- Glow overlay that appears on hover -->
        <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
        
        <img 
          [src]="image()" 
          [alt]="title()" 
          class="w-full h-full object-cover group-hover:scale-110 transition duration-700 ease-out transform-gpu" 
          loading="lazy" 
        />
        
        <!-- Hover prompt text -->
        <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20 scale-90 group-hover:scale-100 transform-gpu">
          <span class="px-4 py-2 bg-white/20 backdrop-blur-md text-white rounded-lg text-sm font-semibold shadow-lg border border-white/20">
            Ver detalhes
          </span>
        </div>
      </div>

      <!-- Content Section -->
      <div class="p-5 flex flex-col h-full justify-between bg-gradient-to-b from-card to-card/95">
        <div class="space-y-2 mb-4">
          <h3 class="font-bold text-xl text-foreground tracking-tight group-hover:text-primary transition-colors line-clamp-1">
            {{ title() }}
          </h3>
          <p class="text-sm text-muted-foreground leading-relaxed line-clamp-2 font-medium">
            {{ description() }}
          </p>
        </div>
        
        <!-- Footer info card -->
        <div class="pt-4 border-t border-border/50 flex items-center justify-between mt-auto">
          <div class="flex flex-col">
            <span class="text-xs font-bold text-muted-foreground/70 uppercase tracking-widest">Preço</span>
            <span class="text-xl font-extrabold text-foreground group-hover:text-primary transition-colors">
              {{ price() | currencyBr }}
            </span>
          </div>
          
          @if (sales()) {
            <div class="px-2.5 py-1 rounded-full bg-accent/50 text-accent-foreground text-xs font-bold border border-accent/50">
              {{ sales() }} vendas
            </div>
          }
        </div>
      </div>
    </a>
  `,
})
export class ProductCardComponent {
  readonly id = input.required<string>();
  readonly title = input.required<string>();
  readonly description = input.required<string>();
  readonly price = input.required<number>();
  readonly image = input.required<string>();
  readonly sales = input<number>(0);
}
