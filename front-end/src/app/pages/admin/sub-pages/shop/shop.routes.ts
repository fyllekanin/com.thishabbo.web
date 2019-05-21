import { PageComponent } from 'shared/page/page.component';
import { Routes } from '@angular/router';
import { ItemsListComponent } from './items/list/items-list.component';
import { SubscriptionsListService } from './services/subscriptions-list.service';
import { SubscriptionsListComponent } from './subscriptions/list/subscriptions-list.component';
import { SubscriptionComponent } from './subscriptions/subscription/subscription.component';
import { SubscriptionService } from './services/subscription.service';

export const shopRoutes: Routes = [
    {
        path: '',
        component: PageComponent,
        children: [
            {
                path: '',
                redirectTo: 'items/page/1'
            },
            {
                path: 'items/page/:page',
                component: ItemsListComponent
            },
            {
                path: 'subscriptions/page/:page',
                component: SubscriptionsListComponent,
                resolve: {
                    data: SubscriptionsListService
                }
            },
            {
                path: 'subscriptions/:subscriptionId',
                component: SubscriptionComponent,
                resolve: {
                    data: SubscriptionService
                }
            }
        ]
    }
];
