import { PageModule } from 'shared/page/page.module';
import { accessRoutes } from './access.routes';
import { DefaultAcccessComponent } from './default/default-access.component';
import { TitleModule } from 'shared/app-views/title/title.module';
import { ContentModule } from 'shared/app-views/content/content.module';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MaintenanceComponent } from './maintenance/maintenance.component';
import { MaintenanceResolver } from './maintenance/maintenance.resolver';

@NgModule({
    imports: [
        RouterModule.forChild(accessRoutes),
        TitleModule,
        ContentModule,
        PageModule
    ],
    declarations: [
        DefaultAcccessComponent,
        MaintenanceComponent
    ],
    providers: [
        MaintenanceResolver
    ],
    exports: [
        RouterModule
    ]
})

export class AccessModule {}
