import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, map, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class JWTInterceptor implements HttpInterceptor {

  constructor(private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    request = request.clone({
      withCredentials: true
    });
    
    return next.handle(request).pipe(
      catchError(error => {
      if (error instanceof HttpErrorResponse) {
        if (error.status === 401) {
            this.router.navigate(['/login'])
        }
      }
      console.log('user not authenticated')
      return throwError(() => new Error('user is not authenticated'))
    }));
  }
}
