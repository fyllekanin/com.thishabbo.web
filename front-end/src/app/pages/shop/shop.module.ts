import { NgModule } from '@angular/core';
import { PageModule } from 'shared/page/page.module';
import { ContentModule } from 'shared/app-views/content/content.module';
import { TitleModule } from 'shared/app-views/title/title.module';
import { RouterModule } from '@angular/router';
import { InfoBoxModule } from 'shared/app-views/info-box/info-box.module';
import { TableModule } from 'shared/components/table/table.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaginationModule } from 'shared/app-views/pagination/pagination.module';
import { SideMenuModule } from 'shared/app-views/side-menu/side-menu.module';
import { ShopComponent } from './shop.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { shopRoutes } from './shop.routes';
import { DashboardResolver } from './services/dashboard.resolver';
import { LootBoxComponent } from './views/loot-box/loot-box.component';
import { SubscriptionComponent } from './views/subscription/subscription.component';
import { LootBoxesComponent } from './loot-boxes/loot-boxes.component';
import { LootBoxesResolver } from './services/loot-boxes.resolver';
import { SubscriptionsComponent } from './subscriptions/subscriptions.component';
import { SubscriptionsResolver } from './services/subscriptions.resolver';
import { LootBoxDetailsComponent } from './views/loot-box/loot-box-details/loot-box-details.component';
import { ButtonModule } from 'shared/directives/button/button.module';
import { SafeHtmlModule } from 'shared/pipes/safe-html/safe-html.module';
import { NgxPayPalModule } from 'ngx-paypal';
import { SubscriptionPaymentComponent } from './views/subscription/subscription-payment/subscription-payment.component';
import { SendThcComponent } from './send-thc/send-thc.component';
import { RotatedItemComponent } from './views/rotated-item/rotated-item.component';

@NgModule({
    imports: [
        RouterModule.forChild(shopRoutes),
        PageModule,
        ContentModule,
        TitleModule,
        InfoBoxModule,
        TableModule,
        CommonModule,
        FormsModule,
        PaginationModule,
        SideMenuModule,
        ButtonModule,
        SafeHtmlModule,
        NgxPayPalModule,
        ButtonModule
    ],
    declarations: [
        ShopComponent,
        DashboardComponent,
        LootBoxComponent,
        SubscriptionComponent,
        LootBoxesComponent,
        SubscriptionsComponent,
        LootBoxDetailsComponent,
        SubscriptionPaymentComponent,
        SendThcComponent,
        RotatedItemComponent
    ],
    entryComponents: [
        LootBoxDetailsComponent,
        SubscriptionPaymentComponent,
        RotatedItemComponent
    ],
    providers: [
        DashboardResolver,
        LootBoxesResolver,
        SubscriptionsResolver
    ],
    exports: [
        RouterModule
    ]
})
export class ShopModule {
}
