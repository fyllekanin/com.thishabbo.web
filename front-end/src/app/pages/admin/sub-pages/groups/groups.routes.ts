import { GroupResolver } from './services/group.resolver';
import { GroupComponent } from './group/group.component';
import { GroupsListResolver } from './services/groups-list.resolver';
import { GroupsListComponent } from './list/groups-list.component';
import { PageComponent } from 'shared/page/page.component';
import { Routes } from '@angular/router';

export const groupRoutes: Routes = [
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
                component: GroupsListComponent,
                resolve: {
                    data: GroupsListResolver
                }
            },
            {
                path: ':groupId',
                component: GroupComponent,
                resolve: {
                    data: GroupResolver
                }
            }
        ]
    }
];
