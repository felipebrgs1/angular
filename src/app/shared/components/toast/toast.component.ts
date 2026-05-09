import { Component, inject } from '@angular/core';
import { NotificationService } from '@core/services/notification.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  template: `
    <div class="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
      @for (t of notif.toasts(); track t.id) {
        <div
          class="px-4 py-3 rounded-lg shadow-lg text-white text-sm font-medium flex items-center gap-3 animate-slide-up"
          [class.bg-primary]="t.type === 'success'"
          [class.bg-destructive]="t.type === 'error'"
          [class.bg-muted-foreground]="t.type === 'info'"
        >
          @if (t.type === 'success') {
            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          } @else if (t.type === 'error') {
            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          } @else {
            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          <span class="flex-1">{{ t.message }}</span>
          <button (click)="notif.dismiss(t.id)" class="text-white/70 hover:text-white transition">&times;</button>
        </div>
      }
    </div>
  `,
  styles: `
    @keyframes slide-up {
      from { opacity: 0; transform: translateY(1rem); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .animate-slide-up { animation: slide-up 0.2s ease-out; }
  `,
})
export class ToastComponent {
  protected notif = inject(NotificationService);
}
