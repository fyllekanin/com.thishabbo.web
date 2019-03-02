import { Routes } from '@angular/router';
import { PageComponent } from 'shared/page/page.component';
import { ListComponent } from './categories/list/list.component';
import { CategoriesListResolver } from './services/categories-list.resolver';
import { CategoryComponent } from './categories/category/category.component';
import { CategoryResolver } from './services/category.resolver';
import { BetListComponent } from './bets/list/bet-list.component';
import { BetListResolver } from './services/bet-list.resolver';
import { BetComponent } from './bets/bet/bet.component';
import { BetResolver } from './services/bet.resolver';

export const bettingRoutes: Routes = [
    {
        path: '',
        component: PageComponent,
        children: [
            {
                path: '',
                redirectTo: 'categories/page/1'
            },
            {
                path: 'bets',
                children: [
                    {
                        path: '',
                        redirectTo: 'page/1'
                    },
                    {
                        path: 'page/:page',
                        component: BetListComponent,
                        resolve: {
                            data: BetListResolver
                        }
                    },
                    {
                        path: ':betId',
                        component: BetComponent,
                        resolve: {
                            data: BetResolver
                        }
                    }
                ]
            },
            {
                path: 'categories',
                children: [
                    {
                        path: '',
                        redirectTo: 'page/1'
                    },
                    {
                        path: 'page/:page',
                        component: ListComponent,
                        resolve: {
                            data: CategoriesListResolver
                        }
                    },
                    {
                        path: ':betCategoryId',
                        component: CategoryComponent,
                        resolve: {
                            data: CategoryResolver
                        }
                    }
                ]
            }
        ]
    }
];
