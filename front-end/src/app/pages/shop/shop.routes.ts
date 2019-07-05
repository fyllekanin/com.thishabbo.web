import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ShopComponent } from './shop.component';
import { DashboardResolver } from './services/dashboard.resolver';
import { LootBoxesComponent } from './loot-boxes/loot-boxes.component';
import { LootBoxesResolver } from './services/loot-boxes.resolver';
import { SubscriptionsComponent } from './subscriptions/subscriptions.component';
import { SubscriptionsResolver } from './services/subscriptions.resolver';

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
            },
            {
                path: 'loot-boxes/page/:page',
                component: LootBoxesComponent,
                resolve: {
                    data: LootBoxesResolver
                }
            },
            {
                path: 'subscriptions/page/:page',
                component: SubscriptionsComponent,
                resolve: {
                    data: SubscriptionsResolver
                }
            }
        ]
    }
];
