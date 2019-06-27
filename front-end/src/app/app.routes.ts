import { Routes } from '@angular/router';
import { HomePageGuard } from 'core/services/auth/home-page.guard';
import { DummyComponent } from './app.component';

export const appRoutes: Routes = [
    {
        path: 'auth',
        loadChildren: () => import('./pages/auth/auth.module').then(m => m.AuthModule)
    },
    {
        path: 'sitecp',
        loadChildren: () => import('./pages/sitecp/sitecp.module').then(m => m.SitecpModule)
    },
    {
        path: 'staff',
        loadChildren: () => import('./pages/staff/staff.module').then(m => m.StaffModule)
    },
    {
        path: 'forum',
        loadChildren: () => import('./pages/forum/forum.module').then(m => m.ForumModule)
    },
    {
        path: 'access',
        loadChildren: () => import('./pages/access/access.module').then(m => m.AccessModule)
    },
    {
        path: 'user',
        loadChildren: () => import('./pages/user/user.module').then(m => m.UserModule)
    },
    {
        path: 'arcade',
        loadChildren: () => import('./pages/arcade/arcade.module').then(m => m.ArcadeModule)
    },
    {
        path: 'betting',
        loadChildren: () => import('./pages/betting/betting.module').then(m => m.BettingModule)
    },
    {
        path: 'goodies',
        loadChildren: () => import('./pages/goodies/goodies.module').then(m => m.GoodiesModule)
    },
    {
        path: 'page',
        loadChildren: () => import('./pages/custom/custom.module').then(m => m.CustomModule)
    },
    {
        path: 'home',
        loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule)
    },
    {
        path: '',
        pathMatch: 'full',
        canActivate: [HomePageGuard],
        component: DummyComponent
    },
    {
        path: '**',
        redirectTo: '/page/access'
    }
];
