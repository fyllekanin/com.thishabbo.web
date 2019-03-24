import { PageComponent } from 'shared/page/page.component';
import { Routes } from '@angular/router';
import { ListComponent } from './items/list/list.component';

export const shopRoutes: Routes = [
    {
        path: '',
        component: PageComponent,
        children: [
            {
                path: '',
                redirectTo: 'items/page/1'
            },
            {
                path: 'items/page/:page',
                component: ListComponent
            }
        ]
    }
];
