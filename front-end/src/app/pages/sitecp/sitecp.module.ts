import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ContentModule } from 'shared/app-views/content/content.module';
import { SideMenuModule } from 'shared/app-views/side-menu/side-menu.module';
import { StatsBoxesModule } from 'shared/app-views/stats-boxes/stats-boxes.module';
import { TitleModule } from 'shared/app-views/title/title.module';
import { TableModule } from 'shared/components/table/table.module';
import { PageModule } from 'shared/page/page.module';
import { SafeHtmlModule } from 'shared/pipes/safe-html/safe-html.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardService } from './dashboard/dashboard.service';
import { ServerLogsComponent } from './server-logs/server-logs.component';
import { ServerLogsService } from './server-logs/server-logs.service';
import { SitecpComponent } from './sitecp.component';
import { sitecpRoutes } from './sitecp.routes';

@NgModule({
    imports: [
        RouterModule.forChild(sitecpRoutes),
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
        SitecpComponent,
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

export class SitecpModule {
}
