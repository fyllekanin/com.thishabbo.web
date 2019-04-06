import { Routes } from '@angular/router';

export const appRoutes: Routes = [
    {
        path: 'auth',
        loadChildren: './pages/auth/auth.module#AuthModule'
    },
    {
        path: 'admin',
        loadChildren: './pages/admin/admin.module#AdminModule'
    },
    {
        path: 'staff',
        loadChildren: './pages/staff/staff.module#StaffModule'
    },
    {
        path: 'forum',
        loadChildren: './pages/forum/forum.module#ForumModule'
    },
    {
        path: 'access',
        loadChildren: './pages/access/access.module#AccessModule'
    },
    {
        path: 'user',
        loadChildren: './pages/user/user.module#UserLinkModule'
    },
    {
        path: 'arcade',
        loadChildren: './pages/arcade/arcade.module#ArcadeModule'
    },
    {
        path: 'betting',
        loadChildren: './pages/betting/betting.module#BettingModule'
    },
    {
        path: 'goodies',
        loadChildren: './pages/goodies/goodies.module#GoodiesModule'
    },
    {
        path: 'page',
        loadChildren: './pages/custom/custom.module#CustomModule'
    },
    {
        path: 'home',
        loadChildren: './pages/home/home.module#HomeModule'
    },
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'home'
    },
    {
        path: '**',
        redirectTo: '/page/access'
    }
];
