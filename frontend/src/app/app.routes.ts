import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./views/home/home').then(m => m.Home)
    },
    {
        path: 'catalog',
        loadComponent: () => import('./views/catalog/catalog').then(m => m.Catalog)
    },
    {
        path: 'auth',
        loadComponent: () => import('./views/auth/auth').then(m => m.Auth),
        children: [
            {
                path: 'login',
                loadComponent: () => import('./views/auth/components/login/login').then(m => m.Login)
            },
            {
                path: 'register',
                loadComponent: () => import('./views/auth/components/register/register').then(m => m.Register)
            },
            {
                path: '**',
                redirectTo: 'login',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: '**',
        redirectTo: '',
        pathMatch: 'full'
    }
];
