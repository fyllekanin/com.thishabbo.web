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

@NgModule({
    imports: [
        RouterModule.forChild(adminRoutes),
        TitleModule,
        ContentModule,
        PageModule,
        FormsModule,
        CommonModule,
        SideMenuModule,
        TableModule
    ],
    declarations: [
        AdminComponent,
        DashboardComponent
    ],
    providers: [],
    exports: [
        RouterModule
    ]
})

export class AdminModule {
}
