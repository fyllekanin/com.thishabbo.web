import { Routes } from '@angular/router';
import { UsercpComponent } from './usercp.component';
import { DashboardResolver } from './account/dashboard/dashboard.resolver';


export const usercpRoutes: Routes = [
    {
        path: '',
        component: UsercpComponent,
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'account'
            },
            {
                path: 'account',
                resolve: {
                    data: DashboardResolver
                },
                loadChildren: () => import('./account/account.module').then(m => m.AccountModule)
            }
            ,
            {
                path: 'essentials',
                loadChildren: () => import('./essentials/essentials.module').then(m => m.EssentialsModule)
            }
            ,
            {
                path: 'subscriptions',
                loadChildren: () => import('./subscriptions/subscriptions.module').then(m => m.SubscriptionsModule)
            }
        ]
    }
];
