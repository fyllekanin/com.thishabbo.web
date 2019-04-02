import { HomeDefaultResolver } from './services/home-default.resolver';
import { PageComponent } from 'shared/page/page.component';
import { HomeDefaultComponent } from './home-default/home-default.component';
import { Routes } from '@angular/router';
import { LeaderBoardComponent } from './leader-board/leader-board.component';
import { SearchComponent } from './search/search.component';
import { SearchResolver } from './services/search.resolver';

export const homeRoutes: Routes = [
    {
        path: '',
        component: PageComponent,
        children: [
            {
                path: '',
                resolve: {
                    data: HomeDefaultResolver
                },
                component: HomeDefaultComponent
            },
            {
                path: 'leader-board',
                component: LeaderBoardComponent
            },
            {
                path: 'search',
                redirectTo: 'search/threads/page/1'
            },
            {
                path: 'search/:type/page/:page',
                component: SearchComponent,
                runGuardsAndResolvers: 'paramsOrQueryParamsChange',
                resolve: {
                    data: SearchResolver
                }
            }
        ]
    }
];
