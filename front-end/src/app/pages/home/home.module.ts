import { UserProfileModule } from 'shared/directives/user-profile.module';
import { HomeDefaultResolver } from './services/home-default.resolver';
import { FormsModule } from '@angular/forms';
import { PageModule } from 'shared/page/page.module';
import { ContentModule } from 'shared/app-views/content/content.module';
import { TitleModule } from 'shared/app-views/title/title.module';
import { homeRoutes } from './home.routes';
import { HomeDefaultComponent } from './home-default/home-default.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NoticeModule } from 'shared/components/notice/notice.module';
import { ButtonModule } from 'shared/directives/button/button.module';
import { LoginBoxComponent } from './home-default/login-box/login-box.component';
import { InfoBoxModule } from 'shared/app-views/info-box/info-box.module';
import { MediaArticlesComponent } from './home-default/media-articles/media-articles.component';
import { LazyLoadModule } from 'shared/directives/lazy-load/lazy-load.module';
import { SafeStyleModule } from 'shared/pipes/safe-style/safe-style.module';
import { SafeHtmlModule } from 'shared/pipes/safe-html/safe-html.module';
import { StaffSpotlightComponent } from './home-default/staff-spotlight/staff-spotlight.component';
import { SearchComponent } from './search/search.component';
import { SearchResolver } from './services/search.resolver';
import { PaginationModule } from 'shared/app-views/pagination/pagination.module';
import { GroupListComponent } from './group-list/group-list.component';
import { GroupListResolver } from './services/group-list.resolver';
import { UserLinkModule } from 'shared/components/user/user-link.module';
import { SlimArticleModule } from 'shared/components/slim-article/slim-article.module';

@NgModule({
    imports: [
        RouterModule.forChild(homeRoutes),
        TitleModule,
        ContentModule,
        PageModule,
        FormsModule,
        CommonModule,
        NoticeModule,
        UserProfileModule,
        ButtonModule,
        InfoBoxModule,
        LazyLoadModule,
        SafeStyleModule,
        SafeHtmlModule,
        PaginationModule,
        UserLinkModule,
        SlimArticleModule
    ],
    declarations: [
        HomeDefaultComponent,
        LoginBoxComponent,
        MediaArticlesComponent,
        StaffSpotlightComponent,
        SearchComponent,
        GroupListComponent
    ],
    providers: [
        HomeDefaultResolver,
        SearchResolver,
        GroupListResolver
    ],
    exports: [
        RouterModule
    ]
})

export class HomeModule {
}
