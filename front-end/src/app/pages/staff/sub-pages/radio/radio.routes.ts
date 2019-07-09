import { Routes } from '@angular/router';
import { PageComponent } from 'shared/page/page.component';
import { TimetableComponent } from '../shared/timetable/timetable.component';
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
import { PING_TYPES } from 'core/services/continues-information/continues-information.model';
import { TimetableResolver } from 'shared/services/timetable.resolver';


export const radioRoutes: Routes = [
    {
        path: '',
        component: PageComponent,
        children: [
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
                },
                data: {
                    type: PING_TYPES.STAFF
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
