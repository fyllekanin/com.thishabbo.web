import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ContentModule } from 'shared/app-views/content/content.module';
import { TitleModule } from 'shared/app-views/title/title.module';
import { PageModule } from 'shared/page/page.module';
import { TimetableModule } from '../shared/timetable/timetable.module';
import { TimetableResolver } from '../shared/timetable/timetable.resolver';
import { radioRoutes } from './radio.routes';
import { RequestsComponent } from './requests/requests.component';
import { RequestsResolver } from './services/requests.resolver';
import { ConnectionResolver } from './services/connection.resolver';
import { ConnectionComponent } from './connection/connection.component';
import { InfoBoxModule } from 'shared/app-views/info-box/info-box.module';
import { KickDjComponent } from './kick-dj/kick-dj.component';
import { ManageConnectionComponent } from './manage-connection/manage-connection.component';
import { ManageConnectionResolver } from './services/manage-connection.resolver';
import { TableModule } from 'shared/components/table/table.module';
import { PaginationModule } from 'shared/app-views/pagination/pagination.module';
import { DjSaysComponent } from './dj-says/dj-says.component';
import { DjSaysResolver } from './services/dj-says.resolver';
import { BookingLogModule } from '../shared/booking-log/booking-log.module';

@NgModule({
    imports: [
        RouterModule.forChild(radioRoutes),
        PageModule,
        TitleModule,
        ContentModule,
        CommonModule,
        FormsModule,
        TimetableModule,
        InfoBoxModule,
        TableModule,
        PaginationModule,
        BookingLogModule
    ],
    declarations: [
        RequestsComponent,
        ConnectionComponent,
        KickDjComponent,
        ManageConnectionComponent,
        DjSaysComponent
    ],
    providers: [
        TimetableResolver,
        RequestsResolver,
        ConnectionResolver,
        ManageConnectionResolver,
        DjSaysResolver
    ],
    exports: [
        RouterModule
    ]
})
export class RadioModule {
}
