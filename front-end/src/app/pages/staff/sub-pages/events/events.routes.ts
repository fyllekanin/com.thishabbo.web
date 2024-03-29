import { Routes } from '@angular/router';
import { PageComponent } from 'shared/page/page.component';
import { TimetableComponent } from '../shared/timetable/timetable.component';
import { TypesReolver } from './services/types.resolver';
import { TypesComponent } from './types/types.component';
import { BookingLogComponent } from '../shared/booking-log/booking-log.component';
import { BookingLogResolver } from '../shared/booking-log/booking-log.resolver';
import { BanOnSightListComponent } from './ban-on-sight/list/ban-on-sight-list.component';
import { BanOnSightListResolver } from './services/ban-on-sight-list.resolver';
import { BanOnSightComponent } from './ban-on-sight/ban-on-sight.component';
import { BanOnSightResolver } from './services/ban-on-sight.resolver';
import { SayComponent } from './say/say.component';
import { SayResolver } from './services/say.resolver';
import { TimetableResolver } from 'shared/services/timetable.resolver';
import { EventStatsComponent } from './event-stats/event-stats.component';
import { EventStatsResolver } from './services/event-stats.resolver';

export const eventsRoutes: Routes = [
    {
        path: '',
        component: PageComponent,
        children: [
            {
                path: 'timetable/:day',
                component: TimetableComponent,
                data: { type: 'events' },
                resolve: {
                    data: TimetableResolver
                }
            },
            {
                path: 'booking/page/:page',
                component: BookingLogComponent,
                data: { type: 'events' },
                resolve: {
                    data: BookingLogResolver
                }
            },
            {
                path: 'types/page/:page',
                component: TypesComponent,
                resolve: {
                    data: TypesReolver
                }
            },
            {
                path: 'ban-on-sight',
                component: BanOnSightListComponent,
                resolve: {
                    data: BanOnSightListResolver
                }
            },
            {
                path: 'ban-on-sight/:entryId',
                component: BanOnSightComponent,
                resolve: {
                    data: BanOnSightResolver
                }
            },
            {
                path: 'say',
                component: SayComponent,
                resolve: {
                    data: SayResolver
                }
            },
            {
                path: 'stats',
                component: EventStatsComponent,
                runGuardsAndResolvers: 'paramsOrQueryParamsChange',
                resolve: {
                    data: EventStatsResolver
                }
            }
        ]
    }
];
