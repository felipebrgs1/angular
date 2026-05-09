import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '@core/services/auth.service';

export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password');
  const confirm = control.get('confirmPassword');
  return password && confirm && password.value !== confirm.value ? { passwordMismatch: true } : null;
};

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      flex: 1;
    }
  `,
  template: `
    <div class="flex-1 flex items-center justify-center bg-muted px-4">
      <div class="w-full max-w-sm">
        <h1 class="text-2xl font-bold text-center mb-8 text-foreground">Criar conta</h1>

        @if (error()) {
          <div class="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg mb-6 text-sm">
            {{ error() }}
          </div>
        }

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
          <div>
            <label for="name" class="block text-sm font-medium text-foreground/80 mb-1">Nome</label>
            <input
              id="name"
              type="text"
              formControlName="name"
              class="w-full px-3 py-2 border border-border rounded-lg bg-card text-foreground focus:ring-2 focus:ring-ring focus:border-ring outline-none transition"
              [class.border-destructive/50]="nameInvalid"
              placeholder="Seu nome"
            />
            @if (nameInvalid && form.controls.name.errors?.['required']) {
              <p class="text-destructive text-xs mt-1">Nome é obrigatório</p>
            }
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-foreground/80 mb-1">Email</label>
            <input
              id="email"
              type="email"
              formControlName="email"
              class="w-full px-3 py-2 border border-border rounded-lg bg-card text-foreground focus:ring-2 focus:ring-ring focus:border-ring outline-none transition"
              [class.border-destructive/50]="emailInvalid"
              placeholder="seu@email.com"
            />
            @if (emailInvalid) {
              <p class="text-destructive text-xs mt-1">
                @if (form.controls.email.errors?.['required']) { Email é obrigatório }
                @if (form.controls.email.errors?.['email']) { Email inválido }
              </p>
            }
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-foreground/80 mb-1">Senha</label>
            <input
              id="password"
              type="password"
              formControlName="password"
              class="w-full px-3 py-2 border border-border rounded-lg bg-card text-foreground focus:ring-2 focus:ring-ring focus:border-ring outline-none transition"
              [class.border-destructive/50]="passwordInvalid"
              placeholder="mínimo 6 caracteres"
            />
            @if (passwordInvalid) {
              <p class="text-destructive text-xs mt-1">
                @if (form.controls.password.errors?.['required']) { Senha é obrigatória }
                @if (form.controls.password.errors?.['minlength']) { Mínimo de 6 caracteres }
              </p>
            }
          </div>

          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-foreground/80 mb-1">Confirmar senha</label>
            <input
              id="confirmPassword"
              type="password"
              formControlName="confirmPassword"
              class="w-full px-3 py-2 border border-border rounded-lg bg-card text-foreground focus:ring-2 focus:ring-ring focus:border-ring outline-none transition"
              [class.border-destructive/50]="confirmInvalid"
              placeholder="repita a senha"
            />
            @if (confirmInvalid) {
              <p class="text-destructive text-xs mt-1">
                @if (form.controls.confirmPassword.errors?.['required']) { Confirmação é obrigatória }
                @if (form.errors?.['passwordMismatch']) { Senhas não conferem }
              </p>
            }
          </div>

          <button
            type="submit"
            [disabled]="form.invalid || submitting()"
            class="w-full py-2 px-4 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {{ submitting() ? 'Criando...' : 'Criar conta' }}
          </button>
        </form>

        <p class="text-center mt-6 text-sm text-muted-foreground">
          Já tem conta?
          <a routerLink="/auth/login" class="text-primary hover:underline font-medium">Entrar</a>
        </p>

        <div class="mt-8 p-3 bg-card border border-border rounded-lg text-xs text-muted-foreground space-y-1">
          <p class="font-medium text-foreground/80">Contas de demonstração:</p>
          <p><span class="text-primary">admin@email.com</span> / 123456</p>
          <p><span class="text-primary">seller@email.com</span> / 123456</p>
          <p><span class="text-primary">buyer@email.com</span> / 123456</p>
        </div>
      </div>
    </div>
  `,
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);

  protected submitting = signal(false);
  protected error = signal<string | null>(null);

  protected form = this.fb.nonNullable.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]],
  }, { validators: passwordMatchValidator });

  protected get nameInvalid() {
    const c = this.form.controls.name;
    return c.invalid && (c.dirty || c.touched);
  }

  protected get emailInvalid() {
    const c = this.form.controls.email;
    return c.invalid && (c.dirty || c.touched);
  }

  protected get passwordInvalid() {
    const c = this.form.controls.password;
    return c.invalid && (c.dirty || c.touched);
  }

  protected get confirmInvalid() {
    const c = this.form.controls.confirmPassword;
    return c.invalid && (c.dirty || c.touched);
  }

  protected onSubmit() {
    if (this.form.invalid) return;

    this.submitting.set(true);
    this.error.set(null);

    const { confirmPassword, ...data } = this.form.getRawValue();

    this.auth.register(data).subscribe({
      error: () => {
        this.submitting.set(false);
        this.error.set('Erro ao criar conta. Tente novamente.');
      },
    });
  }
}
