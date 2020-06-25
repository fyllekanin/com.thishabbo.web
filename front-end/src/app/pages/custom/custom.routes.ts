import { PageComponent } from 'shared/page/page.component';
import { Routes } from '@angular/router';
import { CustomPageComponent } from './custom-page/custom-page.component';
import { CustomPageResolver } from './services/custom-page.resolver';
import { SeasonsComponent } from './seasons/seasons.component';
import { BadgeArticlesComponent } from './badge-articles/badge-articles.component';
import { BadgeArticlesResolver } from './services/badge-articles.resolver';
import { ContactComponent } from './contact/contact.component';
import { JobComponent } from './job/job.component';
import { ReportBugComponent } from './report-bug/report-bug.component';
import { TimetableComponent } from './timetable/timetable.component';
import { TimetableResolver } from 'shared/services/timetable.resolver';
import { BadgesComponent } from './badges/badges.component';
import { BadgesPageResolver } from './services/badges-page.resolver';

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
                component: SeasonsComponent
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
                path: 'bug',
                component: ReportBugComponent
            },
            {
                path: 'badge-articles/page/:page',
                component: BadgeArticlesComponent,
                resolve: {
                    data: BadgeArticlesResolver
                }
            },
            {
                path: 'radio-timetable',
                component: TimetableComponent,
                data: { type: 'radio' },
                resolve: {
                    data: TimetableResolver
                }
            },
            {
                path: 'events-timetable',
                component: TimetableComponent,
                data: { type: 'events' },
                resolve: {
                    data: TimetableResolver
                }
            },
            {
                path: 'badges/page/:page',
                component: BadgesComponent,
                resolve: {
                    data: BadgesPageResolver
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
