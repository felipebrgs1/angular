import { Injectable, computed, signal } from '@angular/core';

export interface CartItem {
  id: string;
  title: string;
  price: number;
  qty: number;
  image?: string;
}

export interface Product {
  id: string;
  title: string;
  price: number;
  image?: string;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private _items = signal<CartItem[]>([]);

  readonly items = this._items.asReadonly();
  readonly total = computed(() =>
    this._items().reduce((acc, i) => acc + i.price * i.qty, 0)
  );
  readonly count = computed(() =>
    this._items().reduce((acc, i) => acc + i.qty, 0)
  );

  add(product: Product) {
    this._items.update(items => {
      const exists = items.find(i => i.id === product.id);
      if (exists) return items.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...items, { ...product, qty: 1 }];
    });
  }

  remove(id: string) {
    this._items.update(items => items.filter(i => i.id !== id));
  }

  updateQty(id: string, qty: number) {
    if (qty <= 0) {
      this.remove(id);
      return;
    }
    this._items.update(items =>
      items.map(i => i.id === id ? { ...i, qty } : i)
    );
  }

  clear() {
    this._items.set([]);
  }
}
