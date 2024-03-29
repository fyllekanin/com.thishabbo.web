import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { StaffComponent } from './staff.component';
import { RequestThcComponent } from './request-thc/request-thc.component';
import { ContinuesInformationService } from 'core/services/continues-information/continues-information.service';
import { DashboardService } from './dashboard/dashboard.service';
import { PING_TYPES } from 'core/services/continues-information/continues-information.model';
import { ThcRequestsLogComponent } from './thc-requests-log/thc-requests-log.component';
import { ThcRequestsResolver } from './thc-requests-log/thc-requests-log.resolver';

export const staffRoutes: Routes = [
    {
        path: '',
        component: StaffComponent,
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
                path: 'dashboard/:year/:month/points',
                component: DashboardComponent,
                resolve: {
                    data: DashboardService
                }
            },
            {
                path: 'request-thc',
                component: RequestThcComponent,
                resolve: {
                    ping: ContinuesInformationService
                },
                data: {
                    type: PING_TYPES.STAFF
                }
            },
            {
                path: 'thc-requests-log/page/:page',
                component: ThcRequestsLogComponent,
                resolve: {
                    data: ThcRequestsResolver
                }
            },
            {
                path: 'radio',
                loadChildren: () => import('./sub-pages/radio/radio.module').then(m => m.RadioModule)
            },
            {
                path: 'events',
                loadChildren: () => import('./sub-pages/events/events.module').then(m => m.EventsModule)
            },
            {
                path: 'management',
                loadChildren: () => import('./sub-pages/management/management.module').then(m => m.ManagementModule)
            }
        ]
    }
];
