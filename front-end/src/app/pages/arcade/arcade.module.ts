import { CommonModule } from '@angular/common';
import { ArcadeDefaultComponent } from './arcade-default/arcade-default.component';
import { PageModule } from 'shared/page/page.module';
import { ContentModule } from 'shared/app-views/content/content.module';
import { TitleModule } from 'shared/app-views/title/title.module';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { arcadeRoutes } from './arcade.routes';
import { FastTyperComponent } from './fast-typer/fast-typer.component';
import { FormsModule } from '@angular/forms';
import { FastTyperResolver } from './services/fast-typer.resolver';
import { SnakeComponent } from './snake/snake.component';
import { SnakeResolver } from './services/snake.resolver';
import { SafeStyleModule } from 'shared/pipes/safe-style/safe-style.module';
import { SafeHtmlModule } from 'shared/pipes/safe-html/safe-html.module';
import { StatsBoxesModule } from 'shared/app-views/stats-boxes/stats-boxes.module';
import { ArcadeDefaultResolver } from './services/arcade-default.resolver';

@NgModule({
    imports: [
        RouterModule.forChild(arcadeRoutes),
        TitleModule,
        ContentModule,
        PageModule,
        CommonModule,
        FormsModule,
        SafeStyleModule,
        SafeHtmlModule,
        StatsBoxesModule
    ],
    declarations: [
        ArcadeDefaultComponent,
        FastTyperComponent,
        SnakeComponent
    ],
    providers: [
        FastTyperResolver,
        SnakeResolver,
        ArcadeDefaultResolver
    ],
    exports: [
        RouterModule
    ]
})

export class ArcadeModule {}
