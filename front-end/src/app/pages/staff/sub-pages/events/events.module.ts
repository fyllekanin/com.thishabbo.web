import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ContentModule } from 'shared/app-views/content/content.module';
import { TitleModule } from 'shared/app-views/title/title.module';
import { PageModule } from 'shared/page/page.module';
import { eventsRoutes } from './events.routes';
import { TableModule } from 'shared/components/table/table.module';
import { PaginationModule } from 'shared/app-views/pagination/pagination.module';
import { TimetableModule } from '../shared/timetable/timetable.module';
import { TimetableResolver } from '../shared/timetable/timetable.resolver';
import { TypesReolver } from './services/types.resolver';
import { TypeComponent } from './types/type/type.component';
import { TypesComponent } from './types/types.component';
import { BookingLogModule } from '../shared/booking-log/booking-log.module';
import { BanOnSightListComponent } from './ban-on-sight/list/ban-on-sight-list.component';
import { BanOnSightListResolver } from './services/ban-on-sight-list.resolver';
import { BanOnSightComponent } from './ban-on-sight/ban-on-sight.component';
import { BanOnSightResolver } from './services/ban-on-sight.resolver';

@NgModule({
    imports: [
        RouterModule.forChild(eventsRoutes),
        PageModule,
        TitleModule,
        ContentModule,
        CommonModule,
        FormsModule,
        TableModule,
        TimetableModule,
        PaginationModule,
        BookingLogModule
    ],
    declarations: [
        TypesComponent,
        TypeComponent,
        BanOnSightListComponent,
        BanOnSightComponent
    ],
    providers: [
        TimetableResolver,
        TypesReolver,
        BanOnSightListResolver,
        BanOnSightResolver
    ],
    entryComponents: [
        TypeComponent
    ],
    exports: [
        RouterModule
    ]
})
export class EventsModule {
}
