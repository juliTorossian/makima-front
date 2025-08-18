
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '@core/services/auth';
import { catchError, switchMap, tap, throwError } from 'rxjs';

  export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const token = authService.getAccessToken();

    // Agregamos el token al header
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    return next(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Intentamos renovar el token
          return authService.refreshToken().pipe(
            switchMap((newToken:any) => {
              // Guardamos el nuevo token y repetimos la request
              authService.setAccessToken(newToken.accessToken);

              const newAuthReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${newToken.accessToken}`
                }
              });

              return next(newAuthReq);
            }),
            catchError(refreshError => {
              // Si falla el refresh token → cerramos sesión
              console.log('catchError(refreshError')
              authService.logout();
              return throwError(() => refreshError);
            })
          );
        }

        // Otros errores
        return throwError(() => error);
      })
    );
  };


/*
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '@core/services/auth';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getAccessToken()

  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  return next(authReq);
};
*/