import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyBrPipe } from '../../pipes/currency-br.pipe';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [RouterLink, CurrencyBrPipe],
  template: `
    <a [routerLink]="'/marketplace/' + id()" class="block group">
      <div class="border border-border rounded-xl overflow-hidden bg-card hover:shadow-lg transition">
        <div class="aspect-[4/3] bg-muted overflow-hidden">
          <img [src]="image()" [alt]="title()" class="w-full h-full object-cover group-hover:scale-105 transition duration-300" loading="lazy" />
        </div>
        <div class="p-4 space-y-2">
          <h3 class="font-semibold text-foreground truncate">{{ title() }}</h3>
          <p class="text-sm text-muted-foreground line-clamp-2">{{ description() }}</p>
          <div class="flex items-center justify-between pt-2">
            <span class="text-lg font-bold text-primary">{{ price() | currencyBr }}</span>
            @if (sales()) {
              <span class="text-xs text-muted-foreground">{{ sales() }} vendidos</span>
            }
          </div>
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
