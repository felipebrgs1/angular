import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink],
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      flex: 1;
    }
  `,
  template: `
    <section class="flex-1 flex flex-col items-center justify-evenly overflow-hidden bg-gradient-to-br from-background via-primary/20 to-primary/10 text-foreground px-4">
      <h1 class="text-5xl md:text-7xl font-bold text-center mb-6">
        Templates UI para<br />
        <span class="bg-gradient-to-r from-primary to-destructive bg-clip-text text-transparent">Devs ambiciosos</span>
      </h1>
      <p class="text-lg md:text-xl text-muted-foreground text-center max-w-2xl mb-10">
        Componentes Tailwind prontos para usar. Kits de UI, dashboards e landing pages
        — tudo feito por devs para devs.
      </p>
      <div class="flex gap-4">
        <a routerLink="/marketplace" class="px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition">
          Explorar templates
        </a>
        <a routerLink="/auth/register" class="px-8 py-3 bg-accent/40 border border-border text-muted-foreground font-semibold rounded-lg hover:bg-accent transition">
          Criar conta
        </a>
      </div>
    </section>
  `,
})
export class LandingComponent {}
