import { Routes } from '@angular/router';
import { BettingComponent } from './betting.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HistoryComponent } from './history/history.component';
import { MyBetsComponent } from './my-bets/my-bets.component';
import { DashboardResolver } from './services/dashboard.resolver';
import { MyBetsResolver } from './services/my-bets.resolver';
import { HistoryResolver } from './services/history.resolver';
import { RouletteComponent } from './roulette/roulette.component';
import { RouletteResolver } from './services/roulette.resolver';

export const bettingRoutes: Routes = [
    {
        path: '',
        component: BettingComponent,
        children: [
            {
                path: '',
                redirectTo: 'dashboard'
            },
            {
                path: 'dashboard',
                component: DashboardComponent,
                resolve: {
                    data: DashboardResolver
                }
            },
            {
                path: 'history/page/:page',
                component: HistoryComponent,
                resolve: {
                    data: HistoryResolver
                }
            },
            {
                path: 'my-bets',
                component: MyBetsComponent,
                resolve: {
                    data: MyBetsResolver
                }
            },
            {
                path: 'roulette',
                component: RouletteComponent,
                resolve: {
                    data: RouletteResolver
                }
            }
        ]
    }
];
