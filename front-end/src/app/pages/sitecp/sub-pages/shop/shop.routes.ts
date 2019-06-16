import { PageComponent } from 'shared/page/page.component';
import { Routes } from '@angular/router';
import { ItemsListComponent } from './items/list/items-list.component';
import { SubscriptionsListService } from './services/subscriptions-list.service';
import { SubscriptionsListComponent } from './subscriptions/list/subscriptions-list.component';
import { SubscriptionComponent } from './subscriptions/subscription/subscription.component';
import { SubscriptionService } from './services/subscription.service';
import { ItemsListService } from './services/items-list.service';
import { ItemComponent } from './items/item/item.component';
import { ItemService } from './services/item.service';

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
                component: ItemsListComponent,
                resolve: {
                    data: ItemsListService
                }
            },
            {
                path: 'items/:itemId',
                component: ItemComponent,
                resolve: {
                    data: ItemService
                }
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
