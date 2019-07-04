import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ShopComponent } from './shop.component';
import { DashboardResolver } from './services/dashboard.resolver';

export const shopRoutes: Routes = [
    {
        path: '',
        component: ShopComponent,
        children: [
            {
                path: '',
                redirectTo: 'dashboard'
            },
            {
                path: 'dashboard',
                component: DashboardComponent,
                resolve: {
                    data: DashboardResolver
                }
            }
        ]
    }
];
