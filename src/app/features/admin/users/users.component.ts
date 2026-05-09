import { Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CurrencyBrPipe } from '@shared/pipes/currency-br.pipe';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  active: boolean;
}

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [],
  template: `
    <div class="space-y-6">
      <h1 class="text-2xl font-bold text-foreground">Gerenciar usuários</h1>

      <div class="bg-card border border-border rounded-lg overflow-hidden">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-border bg-muted/50">
              <th class="text-left p-4 text-foreground font-medium">Nome</th>
              <th class="text-left p-4 text-foreground font-medium">Email</th>
              <th class="text-left p-4 text-foreground font-medium">Tipo</th>
              <th class="text-left p-4 text-foreground font-medium">Status</th>
              <th class="text-right p-4 text-foreground font-medium">Ações</th>
            </tr>
          </thead>
          <tbody>
            @for (u of users(); track u.id) {
              <tr class="border-b border-border last:border-0 hover:bg-muted/30 transition">
                <td class="p-4 text-foreground">{{ u.name }}</td>
                <td class="p-4 text-muted-foreground">{{ u.email }}</td>
                <td class="p-4">
                  <span class="px-2 py-1 text-xs rounded-full font-medium"
                    [class.bg-primary/10]="u.role === 'admin'"
                    [class.text-primary]="u.role === 'admin'"
                    [class.bg-secondary]="u.role === 'seller'"
                    [class.text-secondary-foreground]="u.role === 'seller'"
                    [class.bg-accent]="u.role === 'buyer'"
                    [class.text-accent-foreground]="u.role === 'buyer'"
                  >
                    {{ u.role === 'admin' ? 'Admin' : u.role === 'seller' ? 'Vendedor' : 'Comprador' }}
                  </span>
                </td>
                <td class="p-4">
                  <span class="px-2 py-1 text-xs rounded-full font-medium"
                    [class.bg-primary/10]="u.active"
                    [class.text-primary]="u.active"
                    [class.bg-destructive/10]="!u.active"
                    [class.text-destructive]="!u.active"
                  >
                    {{ u.active ? 'Ativo' : 'Inativo' }}
                  </span>
                </td>
                <td class="p-4 text-right">
                  <button
                    (click)="toggle(u)"
                    class="px-3 py-1.5 text-xs font-medium rounded-lg border transition"
                    [class.border-border]="u.active"
                    [class.text-muted-foreground]="u.active"
                    [class.border-destructive/30]="!u.active"
                    [class.text-destructive]="!u.active"
                    [class.hover:bg-accent]="u.active"
                    [class.hover:bg-destructive/10]="!u.active"
                  >
                    {{ u.active ? 'Desativar' : 'Ativar' }}
                  </button>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
})
export class UsersComponent {
  private http = inject(HttpClient);
  protected users = signal<User[]>([]);

  constructor() {
    this.http.get<User[]>('/api/users').subscribe(us => this.users.set(us));
  }

  protected toggle(u: User) {
    const updated = { ...u, active: !u.active };
    this.http.put(`/api/users/${u.id}`, updated).subscribe(() => {
      this.users.update(us => us.map(x => x.id === u.id ? updated : x));
    });
  }
}
