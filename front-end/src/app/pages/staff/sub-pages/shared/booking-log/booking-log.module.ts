import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContentModule } from 'shared/app-views/content/content.module';
import { TitleModule } from 'shared/app-views/title/title.module';
import { PageModule } from 'shared/page/page.module';
import { BookingLogComponent } from './booking-log.component';
import { BookingLogResolver } from './booking-log.resolver';
import { PaginationModule } from 'shared/app-views/pagination/pagination.module';
import { TableModule } from 'shared/components/table/table.module';

@NgModule({
    imports: [
        RouterModule,
        CommonModule,
        FormsModule,
        ContentModule,
        TitleModule,
        PageModule,
        PaginationModule,
        TableModule
    ],
    declarations: [
        BookingLogComponent
    ],
    providers: [
        BookingLogResolver
    ],
    exports: [
        BookingLogComponent
    ]
})
export class BookingLogModule {}
