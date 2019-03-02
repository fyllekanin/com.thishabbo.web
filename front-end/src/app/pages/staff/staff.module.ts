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

@NgModule({
    imports: [
        RouterModule.forChild(staffRoutes),
        TitleModule,
        ContentModule,
        PageModule,
        FormsModule,
        CommonModule,
        SideMenuModule,
        TableModule
    ],
    declarations: [
        StaffComponent,
        DashboardComponent,
        RequestThcComponent
    ],
    providers: [
    ],
    exports: [
        RouterModule
    ]
})

export class StaffModule {
}
