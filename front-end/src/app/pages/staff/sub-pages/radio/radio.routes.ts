import { Routes } from '@angular/router';
import { PageComponent } from 'shared/page/page.component';
import { TimetableComponent } from '../shared/timetable/timetable.component';
import { TimetableResolver } from '../shared/timetable/timetable.resolver';
import { RequestsComponent } from './requests/requests.component';
import { RequestsResolver } from './services/requests.resolver';
import { ConnectionComponent } from './connection/connection.component';
import { ConnectionResolver } from './services/connection.resolver';
import { KickDjComponent } from './kick-dj/kick-dj.component';
import { ManageConnectionComponent } from './manage-connection/manage-connection.component';
import { ManageConnectionResolver } from './services/manage-connection.resolver';
import { DjSaysComponent } from './dj-says/dj-says.component';
import { DjSaysResolver } from './services/dj-says.resolver';
import { BookingLogComponent } from '../shared/booking-log/booking-log.component';
import { BookingLogResolver } from '../shared/booking-log/booking-log.resolver';
import { ContinuesInformationService } from 'core/services/continues-information/continues-information.service';


export const radioRoutes: Routes = [
    {
        path: '',
        component: PageComponent,
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: `timetable/${new Date().getDay() === 0 ? 7 : new Date().getDay()}`
            },
            {
                path: 'timetable',
                redirectTo: `timetable/${new Date().getDay() === 0 ? 7 : new Date().getDay()}`
            },
            {
                path: 'timetable/:day',
                component: TimetableComponent,
                data: { type: 'radio' },
                resolve: {
                    data: TimetableResolver
                }
            },
            {
                path: 'booking/page/:page',
                component: BookingLogComponent,
                data: { type: 'radio' },
                resolve: {
                    data: BookingLogResolver
                }
            },
            {
                path: 'requests',
                component: RequestsComponent,
                resolve: {
                    data: RequestsResolver
                }
            },
            {
                path: 'connection',
                component: ConnectionComponent,
                resolve: {
                    data: ConnectionResolver
                }
            },
            {
                path: 'manage-connection',
                component: ManageConnectionComponent,
                resolve: {
                    data: ManageConnectionResolver
                }
            },
            {
                path: 'kick-dj',
                component: KickDjComponent,
                resolve: {
                    ping: ContinuesInformationService
                }
            },
            {
                path: 'dj-says',
                component: DjSaysComponent,
                resolve: {
                    data: DjSaysResolver
                }
            }
        ]
    }
];
