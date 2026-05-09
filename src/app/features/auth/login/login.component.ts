import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div class="w-full max-w-sm">
        <h1 class="text-2xl font-bold text-center mb-8">Entrar</h1>
        <p class="text-gray-500 text-center">Formulário de login em breve</p>
        <p class="text-center mt-4">
          <a routerLink="/auth/register" class="text-purple-600 hover:underline">Criar conta</a>
        </p>
      </div>
    </div>
  `,
})
export class LoginComponent {}
