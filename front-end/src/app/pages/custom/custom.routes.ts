import { PageComponent } from 'shared/page/page.component';
import { Routes } from '@angular/router';
import { CustomPageComponent } from './custom-page/custom-page.component';
import { CustomPageResolver } from './services/custom-page.resolver';

export const customRoutes: Routes = [
    {
        path: '',
        component: PageComponent,
        children: [
            {
                path: '',
                redirectTo: 'error'
            },
            {
                path: ':page',
                component: CustomPageComponent,
                resolve: {
                    data: CustomPageResolver
                }
            }
        ]
    }
];
