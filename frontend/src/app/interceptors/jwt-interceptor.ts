import { HttpInterceptorFn } from '@angular/common/http';
import { AuthResponse } from '../interfaces/Auth';
import { environment } from '../../environments/environment';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.includes(environment.apiUrl)) {
    const token = localStorage.getItem('accessToken');

    if (token) {
      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      return next(authReq);
    }
  }
  
  return next(req);
};
