import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  
  // Get the auth token from local storage
  const authToken = localStorage.getItem('token');
  
  // Clone the request and add the authorization header if token exists
  if (authToken) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authToken}`
      }
    });
  }
  
  // Handle the response
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // If we get a 401 Unauthorized response, clear the token and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('currentUser');
        router.navigate(['/auth/login']);
      }
      return throwError(() => error);
    })
  );
};