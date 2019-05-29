import { PageComponent } from 'shared/page/page.component';
import { Routes } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { ProfileService } from './profile/profile.service';

export const userRoutes: Routes = [
    {
        path: '',
        component: PageComponent,
        children: [
            {
                path: '',
                redirectTo: 'usercp'
            },
            {
                path: 'profile/:nickname',
                resolve: {
                    data: ProfileService
                },
                component: ProfileComponent
            },
            {
                path: 'profile/:nickname/page/:page',
                resolve: {
                    data: ProfileService
                },
                component: ProfileComponent
            },
            {
                path: 'usercp',
                loadChildren: () => import('./usercp/usercp.module').then(m => m.UsercpModule)
            }
        ]
    }
];
