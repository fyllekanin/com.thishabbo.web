import { AdminComponent } from './admin.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { Routes } from '@angular/router';
import { ContinuesInformationService } from 'core/services/continues-information/continues-information.service';
import { PING_TYPES } from 'core/services/continues-information/continues-information.model';
import { ServerLogsComponent } from './server-logs/server-logs.component';
import { ServerLogsService } from './server-logs/server-logs.service';


export const adminRoutes: Routes = [
    {
        path: '',
        component: AdminComponent,
        children: [
            {
                path: '',
                redirectTo: 'dashboard'
            },
            {
                path: 'dashboard',
                component: DashboardComponent,
                resolve: {
                    ping: ContinuesInformationService
                },
                data: {
                    type: PING_TYPES.ADMIN
                }
            },
            {
                path: 'server-logs',
                component: ServerLogsComponent,
                resolve: {
                    data: ServerLogsService
                }
            },
            {
                path: 'forum',
                loadChildren: './sub-pages/forum/forum.module#ForumModule'
            },
            {
                path: 'groups',
                loadChildren: './sub-pages/groups/groups.module#GroupsModule'
            },
            {
                path: 'users',
                loadChildren: './sub-pages/users/users.module#UsersModule'
            },
            {
                path: 'moderation',
                loadChildren: './sub-pages/moderation/moderation.module#ModerationModule'
            },
            {
                path: 'content',
                loadChildren: './sub-pages/content/content.module#AdminContentModule'
            },
            {
                path: 'badges',
                loadChildren: './sub-pages/badges/badges.module#BadgesModule'
            },
            {
                path: 'statistics',
                loadChildren: './sub-pages/statistics/statistics.module#StatisticsModule'
            },
            {
                path: 'betting',
                loadChildren: './sub-pages/betting/betting.module#BettingModule'
            },
            {
                path: 'website-settings',
                loadChildren: './sub-pages/website-settings/website-settings.module#WebsiteSettingsModule'
            },
            {
                path: 'shop',
                loadChildren: './sub-pages/shop/shop.module#ShopModule'
            }
        ]
    }
];
