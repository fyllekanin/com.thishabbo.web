import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { websiteSettingsRoutes } from './website-settings.routes';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TitleModule } from 'shared/app-views/title/title.module';
import { TableModule } from 'shared/components/table/table.module';
import { ContentModule } from 'shared/app-views/content/content.module';
import { MaintenanceResolver } from './services/maintenance.resolver';
import { MemberOfTheMonthResolver } from './services/member-of-the-month.resolver';
import { NoticeBoardResolver } from './services/notice-board.resolver';
import { StaffOfTheWeekResolver } from './services/staff-of-the-week.resolver';
import { WelcomeBotResolver } from './services/welcome-bot.resolver';
import { WelcomeBotComponent } from './welcome-bot/welcome-bot.component';
import { StaffOfTheWeekComponent } from './staff-of-the-week/staff-of-the-week.component';
import { NoticeBoardComponent } from './notice-board/notice-board.component';
import { CreateNoticeComponent } from './notice-board/create-notice/create-notice.component';
import { MemberOfTheMonthComponent } from './member-of-the-month/member-of-the-month.component';
import { MaintenanceComponent } from './maintenance/maintenance.component';
import { WebsiteSettingsComponent } from './website-settings.component';
import { EditorModule } from 'shared/components/editor/editor.module';
import { NoticeModule } from 'shared/components/notice/notice.module';
import { NavigationService } from './services/navigation.service';
import { NavigationComponent } from './navigation/navigation.component';
import { NavigationItemComponent } from './navigation/navigation-item/navigation-item.component';
import { SiteMessagesComponent } from './site-messages/list/site-messages.component';
import { SiteMessageComponent } from './site-messages/site-message/site-message.component';
import { SiteMessagesResolver } from './services/site-messages.resolver';
import { SiteMessageResolver } from './services/site-message.resolver';
import { PagesComponent } from './pages/list/pages.component';
import { PagesResolver } from './services/pages.resolver';
import { PageComponent } from './pages/page/page.component';
import { PageResolver } from './services/page.resolver';
import { ThemesComponent } from './themes/list/themes.component';
import { ThemesResolver } from './services/themes.resolver';
import { ThemeResolver } from './services/theme.resolver';
import { ThemeComponent } from './themes/theme/theme.component';

@NgModule({
    imports: [
        RouterModule.forChild(websiteSettingsRoutes),
        CommonModule,
        FormsModule,
        TitleModule,
        TableModule,
        ContentModule,
        EditorModule,
        NoticeModule
    ],
    declarations: [
        WelcomeBotComponent,
        StaffOfTheWeekComponent,
        NoticeBoardComponent,
        CreateNoticeComponent,
        MemberOfTheMonthComponent,
        MaintenanceComponent,
        WebsiteSettingsComponent,
        NavigationComponent,
        NavigationItemComponent,
        SiteMessagesComponent,
        SiteMessageComponent,
        PagesComponent,
        PageComponent,
        ThemesComponent,
        ThemeComponent
    ],
    entryComponents: [
        NavigationItemComponent
    ],
    providers: [
        MaintenanceResolver,
        MemberOfTheMonthResolver,
        NoticeBoardResolver,
        StaffOfTheWeekResolver,
        WelcomeBotResolver,
        NavigationService,
        SiteMessagesResolver,
        SiteMessageResolver,
        PagesResolver,
        PageResolver,
        ThemesResolver,
        ThemeResolver
    ],
    exports: [
        RouterModule
    ]
})
export class WebsiteSettingsModule {}
