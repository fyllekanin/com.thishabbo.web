import { PageComponent } from 'shared/page/page.component';
import { Routes } from '@angular/router';
import { CustomPageComponent } from './custom-page/custom-page.component';
import { CustomPageResolver } from './services/custom-page.resolver';
import { LeaderBoardComponent } from './leader-board/leader-board.component';
import { BadgeArticlesComponent } from './badge-articles/badge-articles.component';
import { BadgeArticlesResolver } from './services/badge-articles.resolver';
import { ContactComponent } from './contact/contact.component';
import { JobComponent } from './job/job.component';

export const customRoutes: Routes = [
    {
        path: '',
        component: PageComponent,
        children: [
            {
                path: '',
                redirectTo: 'error'
            },
            {
                path: 'leader-board',
                component: LeaderBoardComponent
            },
            {
                path: 'contact',
                component: ContactComponent
            },
            {
                path: 'job',
                component: JobComponent
            },
            {
                path: 'badge-articles/page/:page',
                component: BadgeArticlesComponent,
                resolve: {
                    data: BadgeArticlesResolver
                }
            },
            {
                path: ':page',
                component: CustomPageComponent,
                resolve: {
                    data: CustomPageResolver
                }
            }
        ]
    }
];
