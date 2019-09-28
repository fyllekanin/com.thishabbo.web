import { FormsModule } from '@angular/forms';
import { PageModule } from 'shared/page/page.module';
import { ContentModule } from 'shared/app-views/content/content.module';
import { TitleModule } from 'shared/app-views/title/title.module';
import { customRoutes } from './custom.routes';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SafeStyleModule } from 'shared/pipes/safe-style/safe-style.module';
import { SafeHtmlModule } from 'shared/pipes/safe-html/safe-html.module';
import { CustomPageComponent } from './custom-page/custom-page.component';
import { CustomPageResolver } from './services/custom-page.resolver';
import { LeaderBoardComponent } from './leader-board/leader-board.component';
import { BadgeArticlesComponent } from './badge-articles/badge-articles.component';
import { BadgeArticlesResolver } from './services/badge-articles.resolver';
import { SlimArticleModule } from 'shared/components/slim-article/slim-article.module';
import { PaginationModule } from 'shared/app-views/pagination/pagination.module';
import { ContactComponent } from './contact/contact.component';
import { JobComponent } from './job/job.component';
import { InfoBoxModule } from 'shared/app-views/info-box/info-box.module';
import { ReportBugComponent } from './report-bug/report-bug.component';
import { TimetableComponent } from './timetable/timetable.component';
import { TimetableResolver } from 'shared/services/timetable.resolver';
import { UserLinkModule } from 'shared/components/user/user-link.module';
import { BadgesModule } from 'shared/components/badges/badges.module';
import { BadgesComponent } from './badges/badges.component';
import { BadgesPageResolver } from './services/badges-page.resolver';

@NgModule({
    imports: [
        RouterModule.forChild(customRoutes),
        TitleModule,
        ContentModule,
        PageModule,
        FormsModule,
        CommonModule,
        SafeStyleModule,
        SafeHtmlModule,
        SlimArticleModule,
        PaginationModule,
        InfoBoxModule,
        UserLinkModule,
        BadgesModule
    ],
    declarations: [
        CustomPageComponent,
        LeaderBoardComponent,
        BadgeArticlesComponent,
        ContactComponent,
        JobComponent,
        ReportBugComponent,
        TimetableComponent,
        BadgesComponent
    ],
    providers: [
        CustomPageResolver,
        BadgeArticlesResolver,
        TimetableResolver,
        BadgesPageResolver
    ],
    exports: [
        RouterModule
    ]
})

export class CustomModule {
}
