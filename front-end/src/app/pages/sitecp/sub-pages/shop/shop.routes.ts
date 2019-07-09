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
import { LootBoxesListComponent } from './loot-boxes/loot-boxes-list/loot-boxes-list.component';
import { LootBoxesListService } from './services/loot-boxes-list.service';
import { LootBoxComponent } from './loot-boxes/loot-box/loot-box.component';
import { LootBoxService } from './services/loot-box.service';
import { ItemUsersComponent } from './items/item-users/item-users.component';
import { ItemUsersResolver } from './services/item-users.resolver';

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
                path: 'items/:itemId/users',
                component: ItemUsersComponent,
                resolve: {
                    data: ItemUsersResolver
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
            },
            {
                path: 'loot-boxes/page/:page',
                component: LootBoxesListComponent,
                resolve: {
                    data: LootBoxesListService
                }
            },
            {
                path: 'loot-boxes/:lootBoxId',
                component: LootBoxComponent,
                resolve: {
                    data: LootBoxService
                }
            }
        ]
    }
];
