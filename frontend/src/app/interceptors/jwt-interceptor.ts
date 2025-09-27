import { HttpInterceptorFn } from '@angular/common/http';
import { AuthResponse } from '../interfaces/Auth';
import { environment } from '../../environments/environment';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.includes(environment.apiUrl)) {
    const loggedUser = JSON.parse(localStorage.getItem('loggedUser') || 'null') as AuthResponse | null;
    
    if (loggedUser) {
      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${loggedUser.token}`
        }
      });
      return next(authReq);
    }
  }
  
  return next(req);
};
