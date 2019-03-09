import { Routes } from '@angular/router';
import { PageComponent } from 'shared/page/page.component';
import { DoNotHireListComponent } from './do-not-hire/list/do-not-hire-list.component';
import { DoNotHireListResolver } from './services/do-not-hire-list.resolver';
import { DoNotHireComponent } from './do-not-hire/do-not-hire.component';
import { DoNotHireResolver } from './services/do-not-hire.resolver';
import { CurrentListenersComponent } from './current-listeners/current-listeners.component';
import { CurrentListenersResolver } from './services/current-listeners.resolver';
import {PermShowsListComponent} from './permshow/list/permshows-list.component';
import {PermShowsListResolver} from './services/permshows-list.resolver';
import {PermShowComponent} from './permshow/permshow.component';
import {PermShowResolver} from './services/permshow.resolver';

export const managementRoutes: Routes = [
    {
        path: '',
        component: PageComponent,
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: `do-not-hire`
            },
            {
                path: 'do-not-hire',
                component: DoNotHireListComponent,
                resolve: {
                     data: DoNotHireListResolver
                }
            },
            {
                path: 'do-not-hire/:entryId',
                component: DoNotHireComponent,
                resolve: {
                    data: DoNotHireResolver
                }
            },
            {
                path: 'current-listeners',
                component: CurrentListenersComponent,
                resolve: {
                    data: CurrentListenersResolver
                }
            },
            {
                path: 'permanent-shows/page/:page',
                component: PermShowsListComponent,
                resolve: {
                    data: PermShowsListResolver
                }
            },
            {
                path: 'permanent-shows/:permShowId',
                component: PermShowComponent,
                resolve: {
                    data: PermShowResolver
                }
            },
        ]
    }
];
