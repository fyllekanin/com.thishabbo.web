import { Routes } from '@angular/router';
import { NotificationSettingsComponent } from './notification-settings/notification-settings.component';
import { UsercpNotificationSettingsService } from './services/usercp-notification-settings.service';
import { ThreadSubscriptionsComponent } from './thread-subscriptions/thread-subscriptions.component';
import { UsercpThreadSubscriptionsService } from './services/usercp-thread-subscriptions.service';
import { CategorySubscriptionsComponent } from './category-subscriptions/category-subscriptions.component';
import { UsercpCategorySubscriptionsService } from './services/usercp-category-subscriptions.service';
import { IgnoredThreadsComponent } from './ignored-threads/ignored-threads.component';
import { UsercpIgnoredThreadsResolver } from './services/usercp-ignored-threads.resolver';
import { IgnoredCategoriesComponent } from './ignored-categories/ignored-categories.component';
import { UsercpIgnoredCategoriesResolver } from './services/usercp-ignored-categories.resolver';

export const subscriptionRoutes: Routes = [
    {
        path: '',
        redirectTo: '../'
    },
    {
        path: 'notification-settings',
        component: NotificationSettingsComponent,
        resolve: {
            data: UsercpNotificationSettingsService
        }
    },
    {
        path: 'thread-subscriptions',
        component: ThreadSubscriptionsComponent,
        resolve: {
            data: UsercpThreadSubscriptionsService
        }
    }
    ,
    {
        path: 'category-subscriptions',
        component: CategorySubscriptionsComponent,
        resolve: {
            data: UsercpCategorySubscriptionsService
        }
    },
    {
        path: 'ignored-threads',
        component: IgnoredThreadsComponent,
        resolve: {
            data: UsercpIgnoredThreadsResolver
        }
    },
    {
        path: 'ignored-categories',
        component: IgnoredCategoriesComponent,
        resolve: {
            data: UsercpIgnoredCategoriesResolver
        }
    }
];
