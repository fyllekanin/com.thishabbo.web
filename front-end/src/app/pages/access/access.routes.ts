import { DefaultAcccessComponent } from './default/default-access.component';
import { PageComponent } from 'shared/page/page.component';
import { Routes } from '@angular/router';
import { MaintenanceComponent } from './maintenance/maintenance.component';
import { MaintenanceResolver } from './maintenance/maintenance.resolver';
import { ContinuesInformationService } from 'core/services/continues-information/continues-information.service';

export const accessRoutes: Routes = [
    {
        path: '',
        component: PageComponent,
        children: [
            {
                path: '',
                component: DefaultAcccessComponent,
                resolve: {
                    ping: ContinuesInformationService
                }
            },
            {
                path: 'maintenance',
                component: MaintenanceComponent,
                resolve: {
                    data: MaintenanceResolver
                }
            }
        ]
    }
];
