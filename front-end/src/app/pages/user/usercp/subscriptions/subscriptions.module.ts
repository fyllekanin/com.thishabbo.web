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
import { CategorySubscriptionsService } from './services/category-subscriptions.service';
import { IgnoredCategoriesResolver } from './services/ignored-categories.resolver';
import { IgnoredThreadsResolver } from './services/ignored-threads.resolver';
import { NotificationSettingsService } from './services/notification-settings.service';
import { ThreadSubscriptionsService } from './services/thread-subscriptions.service';
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
        CategorySubscriptionsService,
        IgnoredCategoriesResolver,
        IgnoredThreadsResolver,
        NotificationSettingsService,
        ThreadSubscriptionsService
    ],
    exports: [
        RouterModule
    ]
})
export class SubscriptionsModule {
}
