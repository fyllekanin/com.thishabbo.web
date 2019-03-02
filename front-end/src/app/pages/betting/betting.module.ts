import { NgModule } from '@angular/core';
import { PageModule } from 'shared/page/page.module';
import { ContentModule } from 'shared/app-views/content/content.module';
import { TitleModule } from 'shared/app-views/title/title.module';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HistoryComponent } from './history/history.component';
import { MyBetsComponent } from './my-bets/my-bets.component';
import { BettingNavComponent } from './betting-nav/betting-nav.component';
import { BettingComponent } from './betting.component';
import { bettingRoutes } from './betting.routes';
import { InfoBoxModule } from 'shared/app-views/info-box/info-box.module';
import { StatsComponent } from './stats/stats.component';
import { DashboardResolver } from './services/dashboard.resolver';
import { TableModule } from 'shared/components/table/table.module';
import { CommonModule } from '@angular/common';
import { PlaceBetComponent } from './dashboard/place-bet/place-bet.component';
import { DashboardService } from './services/dashboard.service';
import { FormsModule } from '@angular/forms';
import { MyBetsResolver } from './services/my-bets.resolver';
import { HistoryResolver } from './services/history.resolver';
import { PaginationModule } from 'shared/app-views/pagination/pagination.module';
import { RouletteComponent } from './roulette/roulette.component';
import { RouletteResolver } from './services/roulette.resolver';

@NgModule({
    imports: [
        RouterModule.forChild(bettingRoutes),
        PageModule,
        ContentModule,
        TitleModule,
        InfoBoxModule,
        TableModule,
        CommonModule,
        FormsModule,
        PaginationModule
    ],
    declarations: [
        StatsComponent,
        BettingNavComponent,
        BettingComponent,
        DashboardComponent,
        HistoryComponent,
        MyBetsComponent,
        PlaceBetComponent,
        RouletteComponent
    ],
    entryComponents: [
        PlaceBetComponent
    ],
    providers: [
        DashboardResolver,
        DashboardService,
        MyBetsResolver,
        HistoryResolver,
        RouletteResolver
    ],
    exports: [
        RouterModule
    ]
})
export class BettingModule {}
