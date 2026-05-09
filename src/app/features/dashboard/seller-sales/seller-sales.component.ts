import { Component, ElementRef, afterNextRender, inject, signal, viewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart } from 'chart.js/auto';
import { CurrencyBrPipe } from '../../../shared/pipes/currency-br.pipe';

interface Sale {
  id: string;
  productId: string;
  qty: number;
  total: number;
  date: string;
}

interface Product {
  id: string;
  title: string;
}

@Component({
  selector: 'app-seller-sales',
  standalone: true,
  imports: [CurrencyBrPipe],
  template: `
    <div class="space-y-6">
      <h1 class="text-2xl font-bold text-foreground">Vendas</h1>

      <div class="grid grid-cols-3 gap-4">
        <div class="bg-card border border-border rounded-lg p-4 text-center">
          <p class="text-2xl font-bold text-primary">{{ totalRevenue | currencyBr }}</p>
          <p class="text-sm text-muted-foreground">Receita total</p>
        </div>
        <div class="bg-card border border-border rounded-lg p-4 text-center">
          <p class="text-2xl font-bold text-foreground">{{ totalSales }}</p>
          <p class="text-sm text-muted-foreground">Vendas</p>
        </div>
        <div class="bg-card border border-border rounded-lg p-4 text-center">
          <p class="text-2xl font-bold text-foreground">{{ uniqueProducts }}</p>
          <p class="text-sm text-muted-foreground">Produtos vendidos</p>
        </div>
      </div>

      <div class="bg-card border border-border rounded-lg p-6">
        <h3 class="font-semibold text-foreground mb-4">Vendas por mês</h3>
        <canvas #chart></canvas>
      </div>
    </div>
  `,
})
export class SellerSalesComponent {
  private http = inject(HttpClient);
  private canvas = viewChild<ElementRef<HTMLCanvasElement>>('chart');

  protected totalRevenue = 0;
  protected totalSales = 0;
  protected uniqueProducts = 0;

  private allSales: Sale[] = [];
  private products: Product[] = [];

  constructor() {
    this.http.get<Sale[]>('/api/sales').subscribe(sales => {
      this.allSales = sales;
      this.totalRevenue = sales.reduce((a, s) => a + s.total, 0);
      this.totalSales = sales.length;
    });

    this.http.get<Product[]>('/api/products').subscribe(ps => {
      this.products = ps;
    });

    afterNextRender(() => {
      this.http.get<Sale[]>('/api/sales').subscribe(sales => {
        const months = this.groupByMonth(sales);
        const canvas = this.canvas()?.nativeElement;
        if (!canvas) return;

        new Chart(canvas, {
          type: 'bar',
          data: {
            labels: months.map(m => m.month),
            datasets: [
              {
                label: 'Vendas',
                data: months.map(m => m.count),
                backgroundColor: 'oklch(0.6397 0.1720 36.4421 / 0.2)',
                borderColor: 'oklch(0.6397 0.1720 36.4421)',
                borderWidth: 2,
                borderRadius: 6,
              },
              {
                label: 'Receita (R$)',
                data: months.map(m => m.revenue),
                backgroundColor: 'oklch(0.7156 0.0605 248.6845 / 0.2)',
                borderColor: 'oklch(0.7156 0.0605 248.6845)',
                borderWidth: 2,
                borderRadius: 6,
              },
            ],
          },
          options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: {
              y: {
                beginAtZero: true,
                grid: { color: 'oklch(0.9022 0.0052 247.8822)' },
              },
              x: {
                grid: { display: false },
              },
            },
          },
        });

        this.uniqueProducts = new Set(sales.map(s => s.productId)).size;
      });
    });
  }

  private groupByMonth(sales: Sale[]) {
    const map = new Map<string, { count: number; revenue: number }>();
    for (const s of sales) {
      const key = s.date.slice(0, 7);
      const g = map.get(key) || { count: 0, revenue: 0 };
      g.count += s.qty;
      g.revenue += s.total;
      map.set(key, g);
    }
    return [...map.entries()]
      .map(([month, data]) => ({ month, ...data }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }
}
