import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private _toasts = signal<Toast[]>([]);
  private nextId = 0;

  readonly toasts = this._toasts.asReadonly();

  success(message: string) {
    this.add(message, 'success');
  }

  error(message: string) {
    this.add(message, 'error');
  }

  info(message: string) {
    this.add(message, 'info');
  }

  dismiss(id: number) {
    this._toasts.update(t => t.filter(x => x.id !== id));
  }

  private add(message: string, type: Toast['type']) {
    const toast: Toast = { id: ++this.nextId, message, type };
    this._toasts.update(t => [...t, toast]);
    setTimeout(() => this.dismiss(toast.id), 4000);
  }
}
