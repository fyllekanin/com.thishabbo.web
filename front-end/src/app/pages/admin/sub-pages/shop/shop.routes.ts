import { Routes } from '@angular/router';
import { PageComponent } from 'shared/page/page.component';
import { CategoriesListComponent } from './categories/list/categories-list.component';
import { CategoryComponent } from './categories/category/category.component';
import { CategoriesListResolver } from './categories/services/categories-list.resolver';
import { CategoryResolver } from './categories/services/category.resolver';

export const shopRoutes: Routes = [
    {
        path: '',
        component: PageComponent,
        children: [
            {
                path: '',
                redirectTo: 'categories/page/1'
            },
            {
                path: 'categories/page/:page',
                component: CategoriesListComponent,
                resolve: {
                    data: CategoriesListResolver
                }
            },
            {
                path: 'categories/:shopCategoryId',
                component: CategoryComponent,
                resolve: {
                    data: CategoryResolver
                }
            }
        ]
    }
];
