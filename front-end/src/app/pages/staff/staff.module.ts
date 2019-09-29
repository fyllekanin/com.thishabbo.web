import { StaffComponent } from './staff.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageModule } from 'shared/page/page.module';
import { ContentModule } from 'shared/app-views/content/content.module';
import { TitleModule } from 'shared/app-views/title/title.module';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NgModule } from '@angular/core';
import { staffRoutes } from './staff.routes';
import { RequestThcComponent } from './request-thc/request-thc.component';
import { SideMenuModule } from 'shared/app-views/side-menu/side-menu.module';
import { TableModule } from 'shared/components/table/table.module';
import { StatsBoxesModule } from 'shared/app-views/stats-boxes/stats-boxes.module';
import { DashboardService } from './dashboard/dashboard.service';
import { ThcRequestsLogComponent } from './thc-requests-log/thc-requests-log.component';
import { ThcRequestsResolver } from './thc-requests-log/thc-requests-log.resolver';
import { PaginationModule } from 'shared/app-views/pagination/pagination.module';

@NgModule({
    imports: [
        RouterModule.forChild(staffRoutes),
        TitleModule,
        ContentModule,
        PageModule,
        FormsModule,
        CommonModule,
        SideMenuModule,
        TableModule,
        StatsBoxesModule,
        PaginationModule
    ],
    declarations: [
        StaffComponent,
        DashboardComponent,
        RequestThcComponent,
        ThcRequestsLogComponent
    ],
    providers: [
        DashboardService,
        ThcRequestsResolver
    ],
    exports: [
        RouterModule
    ]
})

export class StaffModule {
}
