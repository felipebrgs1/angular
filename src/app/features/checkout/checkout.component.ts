import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { CurrencyBrPipe } from '../../shared/pipes/currency-br.pipe';
import { cpfValidator } from '../../shared/validators/cpf.validator';
import { cepValidator } from '../../shared/validators/cep.validator';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CurrencyBrPipe],
  template: `
    <div class="max-w-5xl mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-8 text-foreground">Checkout</h1>

@if (step() === 'confirmation') {
  <div class="text-center py-16">
    <div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
      <svg class="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
      </svg>
    </div>
    <h2 class="text-2xl font-bold text-foreground mb-2">Pedido confirmado!</h2>
    <p class="text-muted-foreground mb-2">Seu pedido #{{ orderId }} foi processado com sucesso.</p>
    <p class="text-muted-foreground mb-8">Você receberá um email com os detalhes da compra.</p>
    <a routerLink="/marketplace" class="inline-block px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition">
      Continuar comprando
    </a>
  </div>
} @else {
  <div class="flex flex-col lg:flex-row gap-8">
    <div class="flex-1">
      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-8">
        <fieldset class="bg-card border border-border rounded-lg p-6 space-y-4">
          <legend class="text-lg font-semibold text-foreground px-2">Endereço de entrega</legend>

          <div class="grid grid-cols-2 gap-4">
            <div class="col-span-2 sm:col-span-1">
              <label class="block text-sm font-medium text-foreground/80 mb-1">CEP</label>
              <input
                type="text"
                formControlName="cep"
                (input)="formatCep($event)"
                maxlength="9"
                class="w-full px-3 py-2 border border-border rounded-lg bg-card text-foreground focus:ring-2 focus:ring-ring focus:border-ring outline-none transition"
                [class.border-destructive/50]="cepInvalid"
                placeholder="00000-000"
              />
              @if (cepInvalid) {
                <p class="text-destructive text-xs mt-1">CEP inválido</p>
              }
            </div>

            <div class="col-span-2 sm:col-span-1">
              <label class="block text-sm font-medium text-foreground/80 mb-1">Estado</label>
              <select
                formControlName="state"
                class="w-full px-3 py-2 border border-border rounded-lg bg-card text-foreground focus:ring-2 focus:ring-ring focus:border-ring outline-none transition"
                [class.border-destructive/50]="stateInvalid"
              >
                <option value="">Selecione</option>
                @for (uf of estados; track uf) {
                  <option [value]="uf">{{ uf }}</option>
                }
              </select>
              @if (stateInvalid) {
                <p class="text-destructive text-xs mt-1">Obrigatório</p>
              }
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-foreground/80 mb-1">Cidade</label>
            <input type="text" formControlName="city" class="w-full px-3 py-2 border border-border rounded-lg bg-card text-foreground focus:ring-2 focus:ring-ring focus:border-ring outline-none transition" [class.border-destructive/50]="cityInvalid" placeholder="São Paulo" />
            @if (cityInvalid) { <p class="text-destructive text-xs mt-1">Obrigatório</p> }
          </div>

          <div class="grid grid-cols-4 gap-4">
            <div class="col-span-3">
              <label class="block text-sm font-medium text-foreground/80 mb-1">Logradouro</label>
              <input type="text" formControlName="street" class="w-full px-3 py-2 border border-border rounded-lg bg-card text-foreground focus:ring-2 focus:ring-ring focus:border-ring outline-none transition" [class.border-destructive/50]="streetInvalid" placeholder="Rua, Avenida..." />
              @if (streetInvalid) { <p class="text-destructive text-xs mt-1">Obrigatório</p> }
            </div>
            <div>
              <label class="block text-sm font-medium text-foreground/80 mb-1">Número</label>
              <input type="text" formControlName="number" class="w-full px-3 py-2 border border-border rounded-lg bg-card text-foreground focus:ring-2 focus:ring-ring focus:border-ring outline-none transition" [class.border-destructive/50]="numberInvalid" placeholder="123" />
              @if (numberInvalid) { <p class="text-destructive text-xs mt-1">Obrigatório</p> }
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-foreground/80 mb-1">Complemento <span class="text-muted-foreground">(opcional)</span></label>
            <input type="text" formControlName="complement" class="w-full px-3 py-2 border border-border rounded-lg bg-card text-foreground focus:ring-2 focus:ring-ring focus:border-ring outline-none transition" placeholder="Apto, Bloco..." />
          </div>

          <div>
            <label class="block text-sm font-medium text-foreground/80 mb-1">Bairro</label>
            <input type="text" formControlName="neighborhood" class="w-full px-3 py-2 border border-border rounded-lg bg-card text-foreground focus:ring-2 focus:ring-ring focus:border-ring outline-none transition" [class.border-destructive/50]="neighborhoodInvalid" placeholder="Centro" />
            @if (neighborhoodInvalid) { <p class="text-destructive text-xs mt-1">Obrigatório</p> }
          </div>
        </fieldset>

        <fieldset class="bg-card border border-border rounded-lg p-6 space-y-4">
          <legend class="text-lg font-semibold text-foreground px-2">Pagamento</legend>

          <div>
            <label class="block text-sm font-medium text-foreground/80 mb-1">Nome no cartão</label>
            <input type="text" formControlName="cardName" class="w-full px-3 py-2 border border-border rounded-lg bg-card text-foreground focus:ring-2 focus:ring-ring focus:border-ring outline-none transition" [class.border-destructive/50]="cardNameInvalid" placeholder="Como está no cartão" />
            @if (cardNameInvalid) { <p class="text-destructive text-xs mt-1">Obrigatório</p> }
          </div>

          <div>
            <label class="block text-sm font-medium text-foreground/80 mb-1">Número do cartão</label>
            <input type="text" formControlName="cardNumber" (input)="formatCardNumber($event)" maxlength="19" class="w-full px-3 py-2 border border-border rounded-lg bg-card text-foreground focus:ring-2 focus:ring-ring focus:border-ring outline-none transition" [class.border-destructive/50]="cardNumberInvalid" placeholder="0000 0000 0000 0000" />
            @if (cardNumberInvalid) { <p class="text-destructive text-xs mt-1">Número inválido</p> }
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-foreground/80 mb-1">Validade</label>
              <input type="text" formControlName="expiry" (input)="formatExpiry($event)" maxlength="5" class="w-full px-3 py-2 border border-border rounded-lg bg-card text-foreground focus:ring-2 focus:ring-ring focus:border-ring outline-none transition" [class.border-destructive/50]="expiryInvalid" placeholder="MM/AA" />
              @if (expiryInvalid) { <p class="text-destructive text-xs mt-1">Inválida</p> }
            </div>
            <div>
              <label class="block text-sm font-medium text-foreground/80 mb-1">CVV</label>
              <input type="text" formControlName="cvv" maxlength="4" class="w-full px-3 py-2 border border-border rounded-lg bg-card text-foreground focus:ring-2 focus:ring-ring focus:border-ring outline-none transition" [class.border-destructive/50]="cvvInvalid" placeholder="123" />
              @if (cvvInvalid) { <p class="text-destructive text-xs mt-1">Inválido</p> }
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-foreground/80 mb-1">CPF do titular</label>
            <input type="text" formControlName="cpf" (input)="formatCpf($event)" maxlength="14" class="w-full px-3 py-2 border border-border rounded-lg bg-card text-foreground focus:ring-2 focus:ring-ring focus:border-ring outline-none transition" [class.border-destructive/50]="cpfInvalid" placeholder="000.000.000-00" />
            @if (cpfInvalid) { <p class="text-destructive text-xs mt-1">CPF inválido</p> }
          </div>
        </fieldset>

        <button
          type="submit"
          [disabled]="form.invalid || submitting()"
          class="w-full py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition text-lg"
        >
          {{ submitting() ? 'Processando...' : 'Pagar ' + (cart.total() | currencyBr) }}
        </button>
      </form>
    </div>

    <div class="w-full lg:w-80">
      <div class="bg-card border border-border rounded-lg p-6 space-y-4 sticky top-24">
        <h3 class="font-semibold text-foreground">Resumo do pedido</h3>
        @for (item of cart.items(); track item.id) {
          <div class="flex items-center gap-3">
            <img [src]="item.image" [alt]="item.title" class="w-12 h-10 object-cover rounded" />
            <div class="flex-1 min-w-0">
              <p class="text-sm text-foreground truncate">{{ item.title }}</p>
              <p class="text-xs text-muted-foreground">{{ item.qty }}x {{ item.price | currencyBr }}</p>
            </div>
            <p class="text-sm font-medium text-foreground">{{ item.price * item.qty | currencyBr }}</p>
          </div>
        }
        <div class="border-t border-border pt-4 flex justify-between">
          <span class="font-semibold text-foreground">Total</span>
          <span class="font-bold text-lg text-primary">{{ cart.total() | currencyBr }}</span>
        </div>
      </div>
    </div>
  </div>
}
    </div>
  `,
})
export class CheckoutComponent {
  private fb = inject(FormBuilder);
  protected cart = inject(CartService);

  protected step = signal<'form' | 'confirmation'>('form');
  protected submitting = signal(false);
  protected orderId = '';

  protected readonly estados = [
    'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO',
  ];

  protected form = this.fb.nonNullable.group({
    cep: ['', [Validators.required, cepValidator]],
    state: ['', Validators.required],
    city: ['', Validators.required],
    street: ['', Validators.required],
    number: ['', Validators.required],
    complement: [''],
    neighborhood: ['', Validators.required],
    cardName: ['', Validators.required],
    cardNumber: ['', [Validators.required, Validators.minLength(16)]],
    expiry: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]],
    cvv: ['', [Validators.required, Validators.minLength(3)]],
    cpf: ['', [Validators.required, cpfValidator]],
  });

  protected get cepInvalid() { const c = this.form.controls.cep; return c.invalid && (c.dirty || c.touched); }
  protected get stateInvalid() { const c = this.form.controls.state; return c.invalid && (c.dirty || c.touched); }
  protected get cityInvalid() { const c = this.form.controls.city; return c.invalid && (c.dirty || c.touched); }
  protected get streetInvalid() { const c = this.form.controls.street; return c.invalid && (c.dirty || c.touched); }
  protected get numberInvalid() { const c = this.form.controls.number; return c.invalid && (c.dirty || c.touched); }
  protected get neighborhoodInvalid() { const c = this.form.controls.neighborhood; return c.invalid && (c.dirty || c.touched); }
  protected get cardNameInvalid() { const c = this.form.controls.cardName; return c.invalid && (c.dirty || c.touched); }
  protected get cardNumberInvalid() { const c = this.form.controls.cardNumber; return c.invalid && (c.dirty || c.touched); }
  protected get expiryInvalid() { const c = this.form.controls.expiry; return c.invalid && (c.dirty || c.touched); }
  protected get cvvInvalid() { const c = this.form.controls.cvv; return c.invalid && (c.dirty || c.touched); }
  protected get cpfInvalid() { const c = this.form.controls.cpf; return c.invalid && (c.dirty || c.touched); }

  protected formatCep(e: Event) {
    const input = e.target as HTMLInputElement;
    let v = input.value.replace(/\D/g, '').slice(0, 8);
    if (v.length > 5) v = v.slice(0, 5) + '-' + v.slice(5);
    this.form.controls.cep.setValue(v, { emitEvent: false });
  }

  protected formatCpf(e: Event) {
    const input = e.target as HTMLInputElement;
    let v = input.value.replace(/\D/g, '').slice(0, 11);
    if (v.length > 9) v = v.slice(0, 3) + '.' + v.slice(3, 6) + '.' + v.slice(6, 9) + '-' + v.slice(9);
    else if (v.length > 6) v = v.slice(0, 3) + '.' + v.slice(3, 6) + '.' + v.slice(6);
    else if (v.length > 3) v = v.slice(0, 3) + '.' + v.slice(3);
    this.form.controls.cpf.setValue(v, { emitEvent: false });
  }

  protected formatCardNumber(e: Event) {
    const input = e.target as HTMLInputElement;
    let v = input.value.replace(/\D/g, '').slice(0, 16);
    v = v.replace(/(.{4})/g, '$1 ').trim();
    this.form.controls.cardNumber.setValue(v, { emitEvent: false });
  }

  protected formatExpiry(e: Event) {
    const input = e.target as HTMLInputElement;
    let v = input.value.replace(/\D/g, '').slice(0, 4);
    if (v.length > 2) v = v.slice(0, 2) + '/' + v.slice(2);
    this.form.controls.expiry.setValue(v, { emitEvent: false });
  }

  protected onSubmit() {
    if (this.form.invalid) return;
    this.submitting.set(true);

    setTimeout(() => {
      this.orderId = '#' + Date.now().toString(36).toUpperCase();
      this.cart.clear();
      this.submitting.set(false);
      this.step.set('confirmation');
    }, 2000);
  }
}
