import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_BASE = 'http://127.0.0.1:8000/api/v1';

export const authInterceptor: HttpInterceptorFn =
  (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {

    // ✅ 1) On n'ajoute le token que pour notre backend
    if (!req.url.startsWith(API_BASE)) {
      return next(req);
    }

    // ✅ 2) Pas d'Authorization sur endpoints auth
    if (req.url.includes('/auth/login') || req.url.includes('/auth/register')) {
      return next(req);
    }

    const token = localStorage.getItem('access_token');
    if (!token) return next(req);

    const authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });

    return next(authReq);
  };
