import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpResponse, HttpHandler, HttpEvent } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class InterceptorService implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token: string = localStorage.getItem('token');
        if (token) {
            request = request.clone({ headers: request.headers.set('Authorization', 'Bearer ' + token) });
        }
        if (!request.headers.has('Content-Type')) {
            request = request.clone({ headers: request.headers.set('Content-Type', 'application/json') });
        }
        request = request.clone({ headers: request.headers.set('Accept', 'application/json') });
        return next.handle(request).pipe(map((event: HttpEvent<any>) => {
            //if (event instanceof HttpResponse) {
            //    console.log('event--->>>', event);
            //}
            return event;
        }));
    }
}
