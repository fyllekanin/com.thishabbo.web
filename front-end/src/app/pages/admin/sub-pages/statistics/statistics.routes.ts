import { Routes } from '@angular/router';
import { PageComponent } from 'shared/page/page.component';
import { UsersStatisticsComponent } from './users-statistics/users-statistics.component';
import { UsersStatisticsResolver } from './services/users-statistics.resolver';
import { PostsStatisticsComponent } from './posts-statistics/posts-statistics.component';
import { PostsStatisticsResolver } from './services/posts-statistics.resolver';
import { ThreadsStatisticsComponent } from './threads-statistics/threads-statistics.component';
import { ThreadsStatisticsResolver } from './services/threads-statistics.resolver';

export const statisticsRoutes: Routes = [
    {
        path: '',
        component: PageComponent,
        children: [
            {
                path: 'users',
                redirectTo: `users/${new Date().getFullYear()}/${new Date().getMonth() + 1}`
            },
            {
                path: 'users/:year/:month',
                component: UsersStatisticsComponent,
                resolve: {
                    data: UsersStatisticsResolver
                }
            },
            {
                path: 'posts',
                redirectTo: `posts/${new Date().getFullYear()}/${new Date().getMonth() + 1}`
            },
            {
                path: 'posts/:year/:month',
                component: PostsStatisticsComponent,
                resolve: {
                    data: PostsStatisticsResolver
                }
            },
            {
                path: 'threads/:year/:month',
                component: ThreadsStatisticsComponent,
                resolve: {
                    data: ThreadsStatisticsResolver
                }
            }
        ]
    }
];
