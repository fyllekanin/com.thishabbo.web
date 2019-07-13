import { HomeDefaultResolver } from './services/home-default.resolver';
import { PageComponent } from 'shared/page/page.component';
import { HomeDefaultComponent } from './home-default/home-default.component';
import { Routes } from '@angular/router';
import { SearchComponent } from './search/search.component';
import { SearchResolver } from './services/search.resolver';
import { GroupListComponent } from './group-list/group-list.component';
import { GroupListResolver } from './services/group-list.resolver';
import { VersionsComponent } from './versions/versions.component';
import { VersionsResolver } from './services/versions.resolver';

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
            },
            {
                path: 'staff-list',
                component: GroupListComponent,
                resolve: {
                    data: GroupListResolver
                }
            },
            {
                path: 'versions/page/:page',
                component: VersionsComponent,
                resolve: {
                    data: VersionsResolver
                }
            }
        ]
    }
];
