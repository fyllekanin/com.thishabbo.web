import { HomeDefaultResolver } from './services/home-default.resolver';
import { PageComponent } from 'shared/page/page.component';
import { HomeDefaultComponent } from './home-default/home-default.component';
import { Routes } from '@angular/router';
import { LeaderBoardComponent } from './leader-board/leader-board.component';

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
            },
            {
                path: 'leader-board',
                component: LeaderBoardComponent
            }
        ]
    }
];
