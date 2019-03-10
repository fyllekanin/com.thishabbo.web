import { PageComponent } from 'shared/page/page.component';
import { Routes } from '@angular/router';
import { MaintenanceComponent } from './maintenance/maintenance.component';
import { MaintenanceResolver } from './maintenance/maintenance.resolver';

export const accessRoutes: Routes = [
    {
        path: '',
        component: PageComponent,
        children: [
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
