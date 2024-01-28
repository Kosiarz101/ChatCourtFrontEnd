import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable()
export class JWTInterceptor implements HttpInterceptor {

  private notFilter = ['/auth/login']

  constructor(private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    request = request.clone({
      withCredentials: true
    });

    if (this.notFilter.some(x => request.url.includes(environment.chatServerUrl + x))) {
      return next.handle(request);
    }

    return next.handle(request).pipe(
      catchError(error => {
      if (error instanceof HttpErrorResponse) {
        if (error.status === 401) {
          console.log('user not authenticated')
          this.router.navigate(['/login'])
        }
        return throwError(() => new Error('jwt interceptor - ' + error.message))
      }
      return throwError(() => new Error('jwt interceptor - something went wrong'))
    }));
  }
}
