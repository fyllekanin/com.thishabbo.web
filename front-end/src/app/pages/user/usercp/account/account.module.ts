import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TitleModule } from 'shared/app-views/title/title.module';
import { ContentModule } from 'shared/app-views/content/content.module';
import { accountRoutes } from './account.routes';
import { GroupsComponent } from './groups/groups.component';
import { HabboComponent } from './habbo/habbo.component';
import { HomePageComponent } from './home-page/home-page.component';
import { NicknameComponent } from './nickname/nickname.component';
import { PasswordComponent } from './password/password.component';
import { GroupsService } from './services/groups.service';
import { HabboService } from './services/habbo.service';
import { StatsBoxesModule } from 'shared/app-views/stats-boxes/stats-boxes.module';
import { ThemeResolver } from './services/theme.resolver';
import { ThemeComponent } from './theme/theme.component';
import { ButtonModule } from 'shared/directives/button/button.module';
import { VoucherCodeComponent } from './voucher-code/voucher-code.component';
import { FollowersComponent } from './followers/followers.component';
import { FollowersService } from './services/followers.service';
import { TableModule } from 'shared/components/table/table.module';
import { PaginationModule } from 'shared/app-views/pagination/pagination.module';

@NgModule({
    imports: [
        RouterModule.forChild(accountRoutes),
        CommonModule,
        FormsModule,
        TitleModule,
        ContentModule,
        StatsBoxesModule,
        ButtonModule,
        TableModule,
        PaginationModule
    ],
    declarations: [
        DashboardComponent,
        GroupsComponent,
        HabboComponent,
        HomePageComponent,
        NicknameComponent,
        PasswordComponent,
        ThemeComponent,
        VoucherCodeComponent,
        FollowersComponent
    ],
    providers: [
        GroupsService,
        HabboService,
        ThemeResolver,
        FollowersService
    ],
    exports: [
        RouterModule
    ]
})
export class AccountModule {}
