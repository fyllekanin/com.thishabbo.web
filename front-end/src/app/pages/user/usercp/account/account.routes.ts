import { Routes } from '@angular/router';
import { UsercpDashboardComponent } from './dashboard/usercp-dashboard.component';
import { UsercpGroupsComponent } from './groups/usercp-groups.component';
import { UsercpGroupsService } from './services/usercp-groups.service';
import { PasswordComponent } from './password/password.component';
import { HomePageComponent } from './home-page/home-page.component';
import { NicknameComponent } from './nickname/nickname.component';
import { HabboComponent } from './habbo/habbo.component';
import { UsercpHabboService } from './services/usercp-habbo.service';
import { ThemeComponent } from './theme/theme.component';
import { UsercpThemeResolver } from './services/usercp-theme.resolver';

export const accountRoutes: Routes = [
    {
        path: '',
        component: UsercpDashboardComponent
    },
    {
        path: 'groups',
        component: UsercpGroupsComponent,
        resolve: {
            data: UsercpGroupsService
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
            data: UsercpHabboService
        }
    },
    {
        path: 'theme',
        component: ThemeComponent,
        resolve: {
            data: UsercpThemeResolver
        }
    }
];
