import { NgModule } from '@angular/core';
import { CategorySubscriptionsComponent } from './category-subscriptions/category-subscriptions.component';
import { IgnoredCategoriesComponent } from './ignored-categories/ignored-categories.component';
import { IgnoredThreadsComponent } from './ignored-threads/ignored-threads.component';
import { NotificationSettingsComponent } from './notification-settings/notification-settings.component';
import { ThreadSubscriptionsComponent } from './thread-subscriptions/thread-subscriptions.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TitleModule } from 'shared/app-views/title/title.module';
import { ContentModule } from 'shared/app-views/content/content.module';
import { UsercpCategorySubscriptionsService } from './services/usercp-category-subscriptions.service';
import { UsercpIgnoredCategoriesResolver } from './services/usercp-ignored-categories.resolver';
import { UsercpIgnoredThreadsResolver } from './services/usercp-ignored-threads.resolver';
import { UsercpNotificationSettingsService } from './services/usercp-notification-settings.service';
import { UsercpThreadSubscriptionsService } from './services/usercp-thread-subscriptions.service';
import { subscriptionRoutes } from './subscriptions.routes';
import { TableModule } from 'shared/components/table/table.module';

@NgModule({
    imports: [
        RouterModule.forChild(subscriptionRoutes),
        CommonModule,
        FormsModule,
        TitleModule,
        ContentModule,
        TableModule
    ],
    declarations: [
        CategorySubscriptionsComponent,
        IgnoredCategoriesComponent,
        IgnoredThreadsComponent,
        NotificationSettingsComponent,
        ThreadSubscriptionsComponent
    ],
    providers: [
        UsercpCategorySubscriptionsService,
        UsercpIgnoredCategoriesResolver,
        UsercpIgnoredThreadsResolver,
        UsercpNotificationSettingsService,
        UsercpThreadSubscriptionsService
    ],
    exports: [
        RouterModule
    ]
})
export class SubscriptionsModule {}
