import { AdminComponent } from './admin.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageModule } from 'shared/page/page.module';
import { ContentModule } from 'shared/app-views/content/content.module';
import { TitleModule } from 'shared/app-views/title/title.module';
import { adminRoutes } from './admin.routes';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NgModule } from '@angular/core';
import { SideMenuModule } from 'shared/app-views/side-menu/side-menu.module';
import { TableModule } from 'shared/components/table/table.module';
import { StatsBoxesModule } from 'shared/app-views/stats-boxes/stats-boxes.module';
import { ServerLogsComponent } from './server-logs/server-logs.component';
import { ServerLogsService } from './server-logs/server-logs.service';
import { SafeHtmlModule } from 'shared/pipes/safe-html/safe-html.module';
import { DashboardService } from './dashboard/dashboard.service';

@NgModule({
    imports: [
        RouterModule.forChild(adminRoutes),
        TitleModule,
        ContentModule,
        PageModule,
        FormsModule,
        CommonModule,
        SideMenuModule,
        TableModule,
        StatsBoxesModule,
        SafeHtmlModule
    ],
    declarations: [
        AdminComponent,
        DashboardComponent,
        ServerLogsComponent
    ],
    providers: [
        ServerLogsService,
        DashboardService
    ],
    exports: [
        RouterModule
    ]
})

export class AdminModule {
}
