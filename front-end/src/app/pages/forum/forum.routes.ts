import { ThreadControllerResolver } from './services/thread-controller.resolver';
import { ThreadControllerComponent } from './category/thread-controller/thread-controller.component';
import { ThreadService } from './services/thread.service';
import { ThreadComponent } from './thread/thread.component';
import { CategoryService } from './services/category.service';
import { CategoryComponent } from './category/category.component';
import { ForumHomeResolver } from './services/forum-home.resolver';
import { ForumHomeComponent } from './forum-home/forum-home.component';
import { PageComponent } from 'shared/page/page.component';
import { Routes } from '@angular/router';
import { LatestPostsResolver } from './services/latest-posts.resolver';
import { LatestPostsComponent } from './latest-posts/latest-posts.component';
import { LatestThreadsResolver } from './services/latest-threads.resolver';
import { LatestThreadsComponent } from './latest-threads/latest-threads.component';

export const forumRoutes: Routes = [
    {
        path: '',
        component: PageComponent,
        children: [
            {
                path: '',
                component: ForumHomeComponent,
                resolve: {
                    data: ForumHomeResolver
                }
            },
            {
                path: 'category/:id/page/:page',
                resolve: {
                    data: CategoryService
                },
                component: CategoryComponent,
                runGuardsAndResolvers: 'always'
            },
            {
                path: 'thread/:id/page/:page',
                resolve: {
                    data: ThreadService
                },
                component: ThreadComponent,
                runGuardsAndResolvers: 'always'
            },
            {
                path: 'thread/:id/page/:page/:postedByUser',
                resolve: {
                    data: ThreadService
                },
                component: ThreadComponent,
                runGuardsAndResolvers: 'always'
            },
            {
                path: 'category/:categoryId/thread/:threadId',
                resolve: {
                    data: ThreadControllerResolver
                },
                component: ThreadControllerComponent
            },
            {
                path: 'latest-posts/page/:page',
                resolve: {
                    data: LatestPostsResolver
                },
                component: LatestPostsComponent
            },
            {
                path: 'latest-threads/page/:page',
                resolve: {
                    data: LatestThreadsResolver
                },
                component: LatestThreadsComponent
            }
        ]
    }
];
