import { BBcodeComponent } from './bbcodes/bbcode/bbcode.component';
import { BBcodesListComponent } from './bbcodes/list/bbcodes-list.component';
import { PageComponent } from 'shared/page/page.component';
import { Routes } from '@angular/router';
import { BBcodesListResolver } from './services/bbcodes-list.resolver';
import { BBcodeResolver } from './services/bbcode.resolver';
import { GroupsListComponent } from './groups-list/groups-list.component';
import { GroupsListResolver } from './services/groups-list.resolver';

export const contentRoutes: Routes = [
    {
        path: '',
        component: PageComponent,
        children: [
            {
                path: '',
                redirectTo: 'notice-board'
            },
            {
                path: 'bbcodes',
                component: BBcodesListComponent,
                resolve: {
                    data: BBcodesListResolver
                }
            },
            {
                path: 'bbcodes/:bbcodeId',
                component: BBcodeComponent,
                resolve: {
                    data: BBcodeResolver
                }
            },
            {
                path: 'groups-list',
                component: GroupsListComponent,
                resolve: {
                    data: GroupsListResolver
                }
            }
        ]
    }
];
