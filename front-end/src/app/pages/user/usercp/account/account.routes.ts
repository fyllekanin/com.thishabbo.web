import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { GroupsComponent } from './groups/groups.component';
import { GroupsService } from './services/groups.service';
import { PasswordComponent } from './password/password.component';
import { HomePageComponent } from './home-page/home-page.component';
import { NicknameComponent } from './nickname/nickname.component';
import { HabboComponent } from './habbo/habbo.component';
import { HabboService } from './services/habbo.service';
import { ThemeComponent } from './theme/theme.component';
import { ThemeResolver } from './services/theme.resolver';
import { VoucherCodeComponent } from './voucher-code/voucher-code.component';
import { FollowersComponent } from './followers/followers.component';
import { FollowersService } from './services/followers.service';
import { NotificationsComponent } from './notifications/notifications.component';
import { NotificationsService } from './services/notifications.service';

export const accountRoutes: Routes = [
    {
        path: '',
        component: DashboardComponent
    },
    {
        path: 'groups',
        component: GroupsComponent,
        resolve: {
            data: GroupsService
        }
    },
    {
        path: 'password',
        component: PasswordComponent
    },
    {
        path: 'home-page',
        component: HomePageComponent
    },
    {
        path: 'nickname',
        component: NicknameComponent
    },
    {
        path: 'habbo',
        component: HabboComponent,
        resolve: {
            data: HabboService
        }
    },
    {
        path: 'theme',
        component: ThemeComponent,
        resolve: {
            data: ThemeResolver
        }
    },
    {
        path: 'voucher-code',
        component: VoucherCodeComponent
    },
    {
        path: 'followers/page/:page',
        component: FollowersComponent,
        resolve: {
            data: FollowersService
        }
    },
    {
        path: 'notifications/page/:page',
        component: NotificationsComponent,
        resolve: {
            data: NotificationsService
        }
    }
];
