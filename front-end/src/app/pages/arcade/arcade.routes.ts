import { PageComponent } from 'shared/page/page.component';
import { Routes } from '@angular/router';
import { ArcadeDefaultComponent } from './arcade-default/arcade-default.component';
import { FastTyperComponent } from './fast-typer/fast-typer.component';
import { FastTyperResolver } from './services/fast-typer.resolver';
import { SnakeComponent } from './snake/snake.component';
import { SnakeResolver } from './services/snake.resolver';
import { ArcadeDefaultResolver } from './services/arcade-default.resolver';

export const arcadeRoutes: Routes = [
    {
        path: '',
        component: PageComponent,
        children: [
            {
                path: '',
                component: ArcadeDefaultComponent,
                resolve: {
                    data: ArcadeDefaultResolver
                }
            },
            {
                path: 'fast-typer',
                component: FastTyperComponent,
                resolve: {
                    data: FastTyperResolver
                }
            },
            {
                path: 'snake',
                component: SnakeComponent,
                resolve: {
                    data: SnakeResolver
                }
            }
        ]
    }
];
