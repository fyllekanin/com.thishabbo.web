import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardService } from './dashboard/dashboard.service';
import { ServerLogsComponent } from './server-logs/server-logs.component';
import { ServerLogsService } from './server-logs/server-logs.service';
import { SitecpComponent } from './sitecp.component';


export const sitecpRoutes: Routes = [
    {
        path: '',
        component: SitecpComponent,
        children: [
            {
                path: '',
                redirectTo: 'dashboard'
            },
            {
                path: 'dashboard',
                component: DashboardComponent,
                resolve: {
                    data: DashboardService
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
                loadChildren: () => import('./sub-pages/forum/forum.module').then(m => m.ForumModule)
            },
            {
                path: 'groups',
                loadChildren: () => import('./sub-pages/groups/groups.module').then(m => m.GroupsModule)
            },
            {
                path: 'users',
                loadChildren: () => import('./sub-pages/users/users.module').then(m => m.UsersModule)
            },
            {
                path: 'moderation',
                loadChildren: () => import('./sub-pages/moderation/moderation.module').then(m => m.ModerationModule)
            },
            {
                path: 'content',
                loadChildren: () => import('./sub-pages/content/content.module').then(m => m.SitecpContentModule)
            },
            {
                path: 'badges',
                loadChildren: () => import('./sub-pages/badges/badges.module').then(m => m.BadgesModule)
            },
            {
                path: 'statistics',
                loadChildren: () => import('./sub-pages/statistics/statistics.module').then(m => m.StatisticsModule)
            },
            {
                path: 'betting',
                loadChildren: () => import('./sub-pages/betting/betting.module').then(m => m.BettingModule)
            },
            {
                path: 'website-settings',
                loadChildren: () => import('./sub-pages/website-settings/website-settings.module').then(m => m.WebsiteSettingsModule)
            },
            {
                path: 'shop',
                loadChildren: () => import('./sub-pages/shop/shop.module').then(m => m.ShopModule)
            }
        ]
    }
];
