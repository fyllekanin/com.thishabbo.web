import { Routes } from '@angular/router';
import { NotificationSettingsComponent } from './notification-settings/notification-settings.component';
import { NotificationSettingsService } from './services/notification-settings.service';
import { ThreadSubscriptionsComponent } from './thread-subscriptions/thread-subscriptions.component';
import { ThreadSubscriptionsService } from './services/thread-subscriptions.service';
import { CategorySubscriptionsComponent } from './category-subscriptions/category-subscriptions.component';
import { CategorySubscriptionsService } from './services/category-subscriptions.service';
import { IgnoredThreadsComponent } from './ignored-threads/ignored-threads.component';
import { IgnoredThreadsResolver } from './services/ignored-threads.resolver';
import { IgnoredCategoriesComponent } from './ignored-categories/ignored-categories.component';
import { IgnoredCategoriesResolver } from './services/ignored-categories.resolver';

export const subscriptionRoutes: Routes = [
    {
        path: '',
        redirectTo: '../'
    },
    {
        path: 'notification-settings',
        component: NotificationSettingsComponent,
        resolve: {
            data: NotificationSettingsService
        }
    },
    {
        path: 'thread-subscriptions',
        component: ThreadSubscriptionsComponent,
        resolve: {
            data: ThreadSubscriptionsService
        }
    }
    ,
    {
        path: 'category-subscriptions',
        component: CategorySubscriptionsComponent,
        resolve: {
            data: CategorySubscriptionsService
        }
    },
    {
        path: 'ignored-threads',
        component: IgnoredThreadsComponent,
        resolve: {
            data: IgnoredThreadsResolver
        }
    },
    {
        path: 'ignored-categories',
        component: IgnoredCategoriesComponent,
        resolve: {
            data: IgnoredCategoriesResolver
        }
    }
];
