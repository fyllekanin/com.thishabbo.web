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
import { ListComponent } from './items/list/list.component';

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
        ListComponent
    ],
    providers: [],
    exports: [
        RouterModule
    ]
})
export class ShopModule {
}
