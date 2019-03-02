import { HomeDefaultResolver } from './services/home-default.resolver';
import { PageComponent } from 'shared/page/page.component';
import { HomeDefaultComponent } from './home-default/home-default.component';
import { Routes } from '@angular/router';

export const homeRoutes: Routes = [
    {
        path: '',
        component: PageComponent,
        children: [
            {
                path: '',
                resolve: {
                    data: HomeDefaultResolver
                },
                component: HomeDefaultComponent
            }
        ]
    }
];
