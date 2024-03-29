import { Routes } from '@angular/router';
import { WebsiteSettingsComponent } from './website-settings.component';
import { ContinuesInformationService } from 'core/services/continues-information/continues-information.service';
import { NoticeBoardComponent } from './notice-board/notice-board.component';
import { NoticeBoardResolver } from './services/notice-board.resolver';
import { CreateNoticeComponent } from './notice-board/create-notice/create-notice.component';
import { BotSettingsComponent } from './bot-settings/bot-settings.component';
import { OutstandingStaffComponent } from './outstanding-staff/outstanding-staff.component';
import { MemberOfTheMonthComponent } from './member-of-the-month/member-of-the-month.component';
import { MaintenanceComponent } from './maintenance/maintenance.component';
import { MaintenanceResolver } from './services/maintenance.resolver';
import { MemberOfTheMonthResolver } from './services/member-of-the-month.resolver';
import { OutstandingStaffResolver } from './services/outstanding-staff.resolver';
import { BotSettingsResolver } from './services/bot-settings-resolver.service';
import { NavigationComponent } from './navigation/navigation.component';
import { NavigationService } from './services/navigation.service';
import { SiteMessagesComponent } from './site-messages/list/site-messages.component';
import { SiteMessagesResolver } from './services/site-messages.resolver';
import { SiteMessageComponent } from './site-messages/site-message/site-message.component';
import { SiteMessageResolver } from './services/site-message.resolver';
import { PagesComponent } from './pages/list/pages.component';
import { PagesResolver } from './services/pages.resolver';
import { PageComponent } from './pages/page/page.component';
import { PageResolver } from './services/page.resolver';
import { ThemesComponent } from './themes/list/themes.component';
import { ThemesResolver } from './services/themes.resolver';
import { ThemeComponent } from './themes/theme/theme.component';
import { ThemeResolver } from './services/theme.resolver';
import { PING_TYPES } from 'core/services/continues-information/continues-information.model';
import { HomePageThreadsComponent } from './home-page-threads/home-page-threads.component';
import { HomePageThreadsResolver } from './services/home-page-threads.resolver';

export const websiteSettingsRoutes: Routes = [
    {
        path: '',
        component: WebsiteSettingsComponent,
        resolve: {
            ping: ContinuesInformationService
        }
    },
    {
        path: 'notice-board',
        component: NoticeBoardComponent,
        resolve: {
            data: NoticeBoardResolver
        }
    },
    {
        path: 'notice-board/create',
        component: CreateNoticeComponent,
        resolve: {
            ping: ContinuesInformationService
        },
        data: {
            type: PING_TYPES.SITECP
        }
    },
    {
        path: 'bot-settings',
        component: BotSettingsComponent,
        resolve: {
            data: BotSettingsResolver
        }
    },
    {
        path: 'outstanding-staff',
        component: OutstandingStaffComponent,
        resolve: {
            data: OutstandingStaffResolver
        }
    },
    {
        path: 'member-of-the-month',
        component: MemberOfTheMonthComponent,
        resolve: {
            data: MemberOfTheMonthResolver
        }
    },
    {
        path: 'maintenance',
        component: MaintenanceComponent,
        resolve: {
            data: MaintenanceResolver
        }
    },
    {
        path: 'navigation',
        component: NavigationComponent,
        resolve: {
            data: NavigationService
        }
    },
    {
        path: 'site-messages',
        component: SiteMessagesComponent,
        resolve: {
            data: SiteMessagesResolver
        }
    },
    {
        path: 'site-messages/:siteMessageId',
        component: SiteMessageComponent,
        resolve: {
            data: SiteMessageResolver
        }
    },
    {
        path: 'pages',
        component: PagesComponent,
        resolve: {
            data: PagesResolver
        }
    },
    {
        path: 'pages/:pageId',
        component: PageComponent,
        resolve: {
            data: PageResolver
        }
    },
    {
        path: 'themes',
        component: ThemesComponent,
        resolve: {
            data: ThemesResolver
        }
    },
    {
        path: 'themes/:themeId',
        component: ThemeComponent,
        resolve: {
            data: ThemeResolver
        }
    },
    {
        path: 'home-page-threads',
        component: HomePageThreadsComponent,
        resolve: {
            data: HomePageThreadsResolver
        }
    }
];
