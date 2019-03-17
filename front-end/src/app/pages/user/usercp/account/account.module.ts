import { NgModule } from '@angular/core';
import { UsercpDashboardComponent } from './dashboard/usercp-dashboard.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TitleModule } from 'shared/app-views/title/title.module';
import { ContentModule } from 'shared/app-views/content/content.module';
import { accountRoutes } from './account.routes';
import { UsercpGroupsComponent } from './groups/usercp-groups.component';
import { HabboComponent } from './habbo/habbo.component';
import { HomePageComponent } from './home-page/home-page.component';
import { NicknameComponent } from './nickname/nickname.component';
import { PasswordComponent } from './password/password.component';
import { UsercpGroupsService } from './services/usercp-groups.service';
import { UsercpHabboService } from './services/usercp-habbo.service';
import { StatsBoxesModule } from 'shared/app-views/stats-boxes/stats-boxes.module';

@NgModule({
    imports: [
        RouterModule.forChild(accountRoutes),
        CommonModule,
        FormsModule,
        TitleModule,
        ContentModule,
        StatsBoxesModule
    ],
    declarations: [
        UsercpDashboardComponent,
        UsercpGroupsComponent,
        HabboComponent,
        HomePageComponent,
        NicknameComponent,
        PasswordComponent
    ],
    providers: [
        UsercpGroupsService,
        UsercpHabboService
    ],
    exports: [
        RouterModule
    ]
})
export class AccountModule {}
