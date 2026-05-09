import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notif = inject(NotificationService);

  return next(req).pipe(
    catchError(err => {
      const msg = err.error?.message || err.statusText || 'Erro inesperado';
      notif.error(msg);
      return throwError(() => err);
    }),
  );
};
