import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { shopRoutes } from './shop.routes';
import { TitleModule } from 'shared/app-views/title/title.module';
import { ContentModule } from 'shared/app-views/content/content.module';
import { PageModule } from 'shared/page/page.module';
import { TableModule } from 'shared/components/table/table.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoriesListComponent } from './categories/list/categories-list.component';
import { CategoryComponent } from './categories/category/category.component';
import { CategoriesListResolver } from './categories/services/categories-list.resolver';
import { CategoryResolver } from './categories/services/category.resolver';
import { PaginationModule } from 'shared/app-views/pagination/pagination.module';

@NgModule({
    imports: [
        RouterModule.forChild(shopRoutes),
        TitleModule,
        ContentModule,
        PageModule,
        TableModule,
        CommonModule,
        FormsModule,
        PaginationModule
    ],
    declarations: [
        CategoriesListComponent,
        CategoryComponent
    ],
    providers: [
        CategoriesListResolver,
        CategoryResolver
    ],
    exports: [
        RouterModule
    ]
})
export class ShopModule {}
