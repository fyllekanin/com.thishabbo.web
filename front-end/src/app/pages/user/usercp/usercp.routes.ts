import { Routes } from '@angular/router';
import { UsercpComponent } from './usercp.component';


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
                loadChildren: './account/account.module#AccountModule'
            }
            ,
            {
                path: 'essentials',
                loadChildren: './essentials/essentials.module#EssentialsModule'
            }
            ,
            {
                path: 'subscriptions',
                loadChildren: './subscriptions/subscriptions.module#SubscriptionsModule'
            }
        ]
    }
];
