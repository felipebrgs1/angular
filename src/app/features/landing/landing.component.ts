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
      position: relative;
      overflow-x: hidden;
    }

    .animate-blob {
      animation: blob 12s infinite;
    }
    .animation-delay-2000 {
      animation-delay: 2s;
    }
    .animation-delay-4000 {
      animation-delay: 4s;
    }

    @keyframes blob {
      0% {
        transform: translate(0px, 0px) scale(1);
      }
      33% {
        transform: translate(30px, -50px) scale(1.1);
      }
      66% {
        transform: translate(-20px, 20px) scale(0.9);
      }
      100% {
        transform: translate(0px, 0px) scale(1);
      }
    }
  `,
  template: `
    <!-- Hero Section -->
    <div class="relative w-full min-h-[90svh] flex items-center justify-center overflow-hidden px-4 pt-32 pb-16">
      <!-- Glowing Orbs Background -->
      <div class="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden opacity-70 dark:opacity-50">
        <div class="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div class="absolute top-[20%] right-[-5%] w-96 h-96 bg-accent/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div class="absolute bottom-[10%] left-[20%] w-80 h-80 bg-destructive/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <div class="max-w-5xl mx-auto text-center flex flex-col items-center">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 mb-8 text-sm font-medium tracking-wide animate-in fade-in slide-in-from-bottom-4 duration-700">
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          Novo Marketplace Lançado
        </div>

        <h1 class="text-5xl md:text-7xl font-extrabold text-foreground tracking-tight mb-6 leading-[1.1] animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
          Acelere o seu <br class="hidden md:block" />
          <span class="bg-gradient-to-r from-primary via-purple-500 to-destructive bg-clip-text text-transparent">desenvolvimento UI</span>
        </h1>

        <p class="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
          A maior biblioteca curada de componentes de alto padrão. Projetado para desenvolvedores 
          que valorizam design limpo, acessível e ultra veloz.
        </p>

        <div class="flex flex-col sm:flex-row gap-4 w-full sm:w-auto animate-in fade-in slide-in-from-bottom-10 duration-700 delay-400">
          <a routerLink="/marketplace" 
             class="px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-xl shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 group">
            Explorar Marketplace
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="group-hover:translate-x-1 transition-transform"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </a>
          <a routerLink="/auth/register" 
             class="px-8 py-4 bg-card border border-border text-foreground font-semibold rounded-xl hover:bg-accent/40 transition-all flex items-center justify-center">
            Criar Conta Gratuitamente
          </a>
        </div>

        <!-- Floating UI Visual Indicator -->
        <div class="mt-16 relative w-full max-w-3xl rounded-2xl border border-border/50 bg-card/30 backdrop-blur-md shadow-2xl p-2 overflow-hidden animate-in fade-in zoom-in-95 duration-1000 delay-500 group">
            <div class="absolute inset-0 bg-gradient-to-tr from-primary/10 to-accent/10 opacity-40 pointer-events-none"></div>
            <div class="relative rounded-xl bg-background overflow-hidden border border-border aspect-[16/9] flex flex-col">
              <!-- Mock Browser Top -->
              <div class="h-8 border-b border-border flex items-center gap-1.5 px-4 bg-muted/50">
                  <div class="w-2.5 h-2.5 rounded-full bg-red-500/60"></div>
                  <div class="w-2.5 h-2.5 rounded-full bg-yellow-500/60"></div>
                  <div class="w-2.5 h-2.5 rounded-full bg-green-500/60"></div>
              </div>
              <!-- Mock Content -->
              <div class="flex-1 p-6 grid grid-cols-3 gap-4 opacity-60 group-hover:opacity-100 transition-opacity duration-500">
                  <div class="bg-muted rounded-lg h-32 animate-pulse"></div>
                  <div class="bg-muted rounded-lg h-32 animate-pulse"></div>
                  <div class="bg-muted rounded-lg h-32 animate-pulse"></div>
                  <div class="bg-muted rounded-lg col-span-2 h-32 animate-pulse"></div>
                  <div class="bg-muted rounded-lg h-32 animate-pulse"></div>
              </div>
            </div>
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <section class="w-full py-24 bg-card/50 border-y border-border relative backdrop-blur-sm">
      <div class="max-w-6xl mx-auto px-4">
        <div class="text-center mb-16">
          <h2 class="text-sm font-bold text-primary uppercase tracking-widest mb-3">Por que nos escolher</h2>
          <h3 class="text-3xl md:text-4xl font-bold text-foreground">Tudo que você precisa para brilhar</h3>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          <!-- Card 1 -->
          <div class="p-6 bg-background rounded-2xl border border-border shadow-sm hover:shadow-md transition-all group hover:-translate-y-1">
            <div class="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.29 7 12 12 20.71 7"/><line x1="12" y1="22" x2="12" y2="12"/></svg>
            </div>
            <h4 class="text-xl font-semibold mb-3">Componentes Prontos</h4>
            <p class="text-muted-foreground leading-relaxed">
              Uma vasta coleção de componentes prontos para integrar no seu projeto Angular com Tailwind CSS.
            </p>
          </div>

          <!-- Card 2 -->
          <div class="p-6 bg-background rounded-2xl border border-border shadow-sm hover:shadow-md transition-all group hover:-translate-y-1">
            <div class="w-12 h-12 rounded-xl bg-accent/20 text-accent-foreground flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
            </div>
            <h4 class="text-xl font-semibold mb-3">Personalização Total</h4>
            <p class="text-muted-foreground leading-relaxed">
              Altere facilmente o tema, cores e tipografia para dar a cara da sua marca aos projetos.
            </p>
          </div>

          <!-- Card 3 -->
          <div class="p-6 bg-background rounded-2xl border border-border shadow-sm hover:shadow-md transition-all group hover:-translate-y-1">
            <div class="w-12 h-12 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/></svg>
            </div>
            <h4 class="text-xl font-semibold mb-3">Performance Pura</h4>
            <p class="text-muted-foreground leading-relaxed">
              Otimizado para SEO e tempos de carregamento ultra rápidos com o poder do SSR e Partial Hydration.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Social Proof/Stats Section -->
    <div class="w-full py-16 border-b border-border">
      <div class="max-w-6xl mx-auto px-4 flex flex-wrap items-center justify-around gap-8 text-center">
        <div>
          <div class="text-4xl font-bold text-foreground mb-1">15k+</div>
          <div class="text-sm text-muted-foreground font-medium uppercase tracking-wider">Usuários Ativos</div>
        </div>
        <div>
          <div class="text-4xl font-bold text-foreground mb-1">300+</div>
          <div class="text-sm text-muted-foreground font-medium uppercase tracking-wider">Componentes</div>
        </div>
        <div>
          <div class="text-4xl font-bold text-foreground mb-1">4.9/5</div>
          <div class="text-sm text-muted-foreground font-medium uppercase tracking-wider">Avaliação Média</div>
        </div>
      </div>
    </div>

    <!-- CTA Section -->
    <section class="w-full py-24 relative overflow-hidden bg-foreground text-background">
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/20 to-transparent opacity-30"></div>
        <div class="relative max-w-4xl mx-auto text-center px-4">
            <h2 class="text-3xl md:text-5xl font-bold mb-10">Pronto para elevar o nível da sua aplicação?</h2>
            <p class="text-background/70 text-lg mb-10 max-w-xl mx-auto">
              Comece hoje mesmo de forma gratuita e veja como a velocidade do seu desenvolvimento duplica.
            </p>
            <a routerLink="/auth/register" class="inline-flex items-center justify-center px-8 py-4 bg-background text-foreground font-bold rounded-xl hover:bg-secondary transition-colors gap-2">
                Criar Conta Agora
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </a>
        </div>
    </section>
  `,
})
export class LandingComponent {}
