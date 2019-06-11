import { NgModule } from '@angular/core';
import { PageModule } from 'shared/page/page.module';
import { TitleModule } from 'shared/app-views/title/title.module';
import { TableModule } from 'shared/components/table/table.module';
import { ContentModule } from 'shared/app-views/content/content.module';
import { RouterModule } from '@angular/router';
import { bettingRoutes } from './betting.routes';
import { ListComponent } from './categories/list/list.component';
import { CategoriesListResolver } from './services/categories-list.resolver';
import { CategoryComponent } from './categories/category/category.component';
import { PaginationModule } from 'shared/app-views/pagination/pagination.module';
import { CategoryResolver } from './services/category.resolver';
import { FormsModule } from '@angular/forms';
import { BetListComponent } from './bets/list/bet-list.component';
import { BetListResolver } from './services/bet-list.resolver';
import { BetComponent } from './bets/bet/bet.component';
import { BetResolver } from './services/bet.resolver';
import { CommonModule } from '@angular/common';
import { ResultComponent } from './bets/list/result/result.component';

@NgModule({
    imports: [
        RouterModule.forChild(bettingRoutes),
        PageModule,
        TitleModule,
        TableModule,
        ContentModule,
        PaginationModule,
        FormsModule,
        CommonModule
    ],
    declarations: [
        ListComponent,
        CategoryComponent,
        BetListComponent,
        BetComponent,
        ResultComponent
    ],
    providers: [
        CategoriesListResolver,
        CategoryResolver,
        BetListResolver,
        BetResolver
    ],
    entryComponents: [
        ResultComponent
    ],
    exports: [
        RouterModule
    ]
})
export class BettingModule {}
