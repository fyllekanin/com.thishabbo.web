import { BadgeResolver } from './services/badge.resolver';
import { BadgeComponent } from './badge/badge.component';
import { BadgesListResolver } from './services/badges-list.resolver';
import { BadgesListComponent } from './list/badges-list.component';
import { PageComponent } from 'shared/page/page.component';
import { Routes } from '@angular/router';
import { BadgeUsersResolver } from './services/badge-users.resolver';
import { BadgeUsersComponent } from './badge-users/badge-users.component';

export const badgeRoutes: Routes = [
    {
        path: '',
        component: PageComponent,
        children: [
            {
                path: '',
                redirectTo: 'page/1'
            },
            {
                path: 'page/:page',
                component: BadgesListComponent,
                resolve: {
                    data: BadgesListResolver
                }
            },
            {
                path: ':badgeId',
                component: BadgeComponent,
                resolve: {
                    data: BadgeResolver
                }
            },
            {
                path: ':badgeId/users',
                component: BadgeUsersComponent,
                resolve: {
                    data: BadgeUsersResolver
                }
            }
        ]
    }
];
