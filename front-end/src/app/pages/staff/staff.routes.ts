import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { StaffComponent } from './staff.component';
import { RequestThcComponent } from './request-thc/request-thc.component';
import { ContinuesInformationService } from 'core/services/continues-information/continues-information.service';
import { DashboardService } from './dashboard/dashboard.service';
import { PING_TYPES } from 'core/services/continues-information/continues-information.model';

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
                path: 'radio',
                loadChildren: './sub-pages/radio/radio.module#RadioModule'
            },
            {
                path: 'events',
                loadChildren: './sub-pages/events/events.module#EventsModule'
            },
            {
                path: 'management',
                loadChildren: './sub-pages/management/management.module#ManagementModule'
            }
        ]
    }
];
