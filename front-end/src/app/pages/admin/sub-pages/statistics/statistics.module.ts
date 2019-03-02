import { PageModule } from 'shared/page/page.module';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { BarChartModule } from 'shared/components/graph/bar-chart/bar-chart.module';
import { statisticsRoutes } from './statistics.routes';
import { UsersStatisticsComponent } from './users-statistics/users-statistics.component';
import { TitleModule } from 'shared/app-views/title/title.module';
import { ContentModule } from 'shared/app-views/content/content.module';
import { UsersStatisticsResolver } from './services/users-statistics.resolver';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PostsStatisticsComponent } from './posts-statistics/posts-statistics.component';
import { PostsStatisticsResolver } from './services/posts-statistics.resolver';

@NgModule({
    imports: [
        RouterModule.forChild(statisticsRoutes),
        PageModule,
        BarChartModule,
        TitleModule,
        ContentModule,
        CommonModule,
        FormsModule
    ],
    declarations: [
        UsersStatisticsComponent,
        PostsStatisticsComponent
    ],
    providers: [
        UsersStatisticsResolver,
        PostsStatisticsResolver
    ],
    exports: [
        RouterModule
    ]
})
export class StatisticsModule {}
