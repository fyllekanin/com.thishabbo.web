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
import { ItemsListService } from './services/items-list.service';
import { ItemComponent } from './items/item/item.component';
import { ItemService } from './services/item.service';
import { LootBoxesListComponent } from './loot-boxes/loot-boxes-list/loot-boxes-list.component';
import { LootBoxesListService } from './services/loot-boxes-list.service';
import { LootBoxService } from './services/loot-box.service';
import { LootBoxComponent } from './loot-boxes/loot-box/loot-box.component';
import { BoxSelectionComponent } from './loot-boxes/loot-box/box-selection/box-selection.component';
import { ItemSelectionComponent } from './loot-boxes/loot-box/item-selection/item-selection.component';
import { SelectBadgeComponent } from './items/item/select-badge/select-badge.component';

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
        SubscriptionComponent,
        ItemComponent,
        LootBoxesListComponent,
        LootBoxComponent,
        BoxSelectionComponent,
        ItemSelectionComponent,
        SelectBadgeComponent
    ],
    providers: [
        SubscriptionsListService,
        SubscriptionService,
        ItemsListService,
        ItemService,
        LootBoxesListService,
        LootBoxService
    ],
    entryComponents: [
        BoxSelectionComponent,
        ItemSelectionComponent,
        SelectBadgeComponent
    ],
    exports: [
        RouterModule
    ]
})
export class ShopModule {
}
