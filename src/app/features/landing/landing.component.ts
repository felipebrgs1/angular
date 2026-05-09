import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800 text-white px-4">
      <h1 class="text-5xl md:text-7xl font-bold text-center mb-6">
        Templates UI para<br />
        <span class="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Devs ambiciosos</span>
      </h1>
      <p class="text-lg md:text-xl text-gray-300 text-center max-w-2xl mb-10">
        Componentes Tailwind prontos para usar. Kits de UI, dashboards e landing pages
        — tudo feito por devs para devs.
      </p>
      <div class="flex gap-4">
        <a routerLink="/marketplace" class="px-8 py-3 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition">
          Explorar templates
        </a>
        <a routerLink="/auth/register" class="px-8 py-3 border border-gray-400 text-gray-200 font-semibold rounded-lg hover:bg-white/10 transition">
          Criar conta
        </a>
      </div>
    </section>
  `,
})
export class LandingComponent {}
