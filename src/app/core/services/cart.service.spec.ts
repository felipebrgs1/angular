import { TestBed } from '@angular/core/testing';
import { CartService } from './cart.service';

describe('CartService', () => {
  let service: CartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartService);
  });

  it('starts empty', () => {
    expect(service.items()).toEqual([]);
    expect(service.count()).toBe(0);
    expect(service.total()).toBe(0);
  });

  it('adds a product', () => {
    service.add({ id: '1', title: 'T1', price: 10 });
    expect(service.items()).toHaveLength(1);
    expect(service.items()[0].qty).toBe(1);
    expect(service.count()).toBe(1);
    expect(service.total()).toBe(10);
  });

  it('increments quantity when adding same product', () => {
    service.add({ id: '1', title: 'T1', price: 10 });
    service.add({ id: '1', title: 'T1', price: 10 });
    expect(service.items()).toHaveLength(1);
    expect(service.items()[0].qty).toBe(2);
    expect(service.count()).toBe(2);
    expect(service.total()).toBe(20);
  });

  it('keeps separate entries for different products', () => {
    service.add({ id: '1', title: 'T1', price: 10 });
    service.add({ id: '2', title: 'T2', price: 20 });
    expect(service.items()).toHaveLength(2);
    expect(service.count()).toBe(2);
    expect(service.total()).toBe(30);
  });

  it('removes a product by id', () => {
    service.add({ id: '1', title: 'T1', price: 10 });
    service.add({ id: '2', title: 'T2', price: 20 });
    service.remove('1');
    expect(service.items()).toHaveLength(1);
    expect(service.items()[0].id).toBe('2');
    expect(service.total()).toBe(20);
  });

  it('updates quantity', () => {
    service.add({ id: '1', title: 'T1', price: 10 });
    service.updateQty('1', 5);
    expect(service.items()[0].qty).toBe(5);
    expect(service.total()).toBe(50);
  });

  it('removes item when quantity set to 0', () => {
    service.add({ id: '1', title: 'T1', price: 10 });
    service.updateQty('1', 0);
    expect(service.items()).toHaveLength(0);
  });

  it('clears all items', () => {
    service.add({ id: '1', title: 'T1', price: 10 });
    service.add({ id: '2', title: 'T2', price: 20 });
    service.clear();
    expect(service.items()).toHaveLength(0);
    expect(service.count()).toBe(0);
    expect(service.total()).toBe(0);
  });

  it('computes count correctly with multiple qtys', () => {
    service.add({ id: '1', title: 'T1', price: 10 });
    service.add({ id: '1', title: 'T1', price: 10 });
    service.add({ id: '2', title: 'T2', price: 5 });
    expect(service.count()).toBe(3);
    expect(service.total()).toBe(25);
  });
});
