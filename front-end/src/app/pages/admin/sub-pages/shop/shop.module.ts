import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ContentModule } from 'shared/app-views/content/content.module';
import { TitleModule } from 'shared/app-views/title/title.module';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { PageModule } from 'shared/page/page.module';
import { TableModule } from 'shared/components/table/table.module';
import { PaginationModule } from 'shared/app-views/pagination/pagination.module';
import { ButtonModule } from 'shared/directives/button/button.module';
import { shopRoutes } from './shop.routes';
import { ItemsListComponent } from './items/list/items-list.component';
import { SubscriptionsListComponent } from './subscriptions/list/subscriptions-list.component';
import { SubscriptionsListService } from './services/subscriptions-list.service';
import { SubscriptionService } from './services/subscription.service';
import { SubscriptionComponent } from './subscriptions/subscription/subscription.component';

@NgModule({
    imports: [
        RouterModule.forChild(shopRoutes),
        PageModule,
        TableModule,
        PaginationModule,
        TitleModule,
        ContentModule,
        FormsModule,
        CommonModule,
        ButtonModule
    ],
    declarations: [
        ItemsListComponent,
        SubscriptionsListComponent,
        SubscriptionComponent
    ],
    providers: [
        SubscriptionsListService,
        SubscriptionService
    ],
    exports: [
        RouterModule
    ]
})
export class ShopModule {
}
