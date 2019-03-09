import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ContentModule } from 'shared/app-views/content/content.module';
import { TitleModule } from 'shared/app-views/title/title.module';
import { EditorModule } from 'shared/components/editor/editor.module';
import { PageModule } from 'shared/page/page.module';
import { AvatarComponent } from './avatar/avatar.component';
import { UsercpDashboardComponent } from './dashboard/usercp-dashboard.component';
import { UsercpGroupsComponent } from './groups/usercp-groups.component';
import { PasswordComponent } from './password/password.component';
import { UsercpAvatarService } from './services/usercp-avatar.service';
import { UsercpGroupsService } from './services/usercp-groups.service';
import { UsercpSignatureService } from './services/usercp-signature.service';
import { UsercpPostBitService } from './services/usercp-post-bit.service';
import { SignatureComponent } from './signature/signature.component';
import { PostBitComponent } from './post-bit/post-bit.component';
import { UsercpComponent } from './usercp.component';
import { usercpRoutes } from './usercp.routes';
import { HomePageComponent } from './home-page/home-page.component';
import { UsercpSocialNetworksService } from './services/usercp-social-networks.service';
import { SocialNetworksComponent } from './social-networks/social-networks.component';
import { NotificationSettingsComponent } from './notification-settings/notification-settings.component';
import { UsercpNotificationSettingsService } from './services/usercp-notification-settings.service';
import { LazyLoadModule } from 'shared/directives/lazy-load/lazy-load.module';
import { SafeHtmlModule } from 'shared/pipes/safe-html/safe-html.module';
import { ThreadSubscriptionsComponent } from './thread-subscriptions/thread-subscriptions.component';
import { UsercpThreadSubscriptionsService } from './services/usercp-thread-subscriptions.service';
import { TableModule } from 'shared/components/table/table.module';
import { SideMenuModule } from 'shared/app-views/side-menu/side-menu.module';
import { CategorySubscriptionsComponent } from './category-subscriptions/category-subscriptions.component';
import { UsercpCategorySubscriptionsService } from './services/usercp-category-subscriptions.service';
import { CoverPhotoComponent } from './cover-photo/cover-photo.component';
import { CoverPhotoWithAvatarModule } from '../cover/cover-photo-with-avatar.module';
import { IgnoredThreadsComponent } from './ignored-threads/ignored-threads.component';
import { UsercpIgnoredCategoriesResolver } from './services/usercp-ignored-categories.resolver';
import { UsercpIgnoredThreadsResolver } from './services/usercp-ignored-threads.resolver';
import { IgnoredCategoriesComponent } from './ignored-categories/ignored-categories.component';
import { UsercpEmailService } from './services/usercp-email.service';
import { EmailComponent } from './email/email.component';
import { NicknameComponent } from './nickname/nickname.component';
import { StatsBoxesModule } from 'shared/app-views/stats-boxes/stats-boxes.module';

@NgModule({
    imports: [
        RouterModule.forChild(usercpRoutes),
        PageModule,
        TitleModule,
        ContentModule,
        CommonModule,
        EditorModule,
        FormsModule,
        LazyLoadModule,
        SafeHtmlModule,
        TableModule,
        SideMenuModule,
        CoverPhotoWithAvatarModule,
        StatsBoxesModule
    ],
    declarations: [
        UsercpDashboardComponent,
        UsercpComponent,
        UsercpGroupsComponent,
        SignatureComponent,
        PasswordComponent,
        AvatarComponent,
        PostBitComponent,
        HomePageComponent,
        SocialNetworksComponent,
        NotificationSettingsComponent,
        ThreadSubscriptionsComponent,
        CategorySubscriptionsComponent,
        CoverPhotoComponent,
        IgnoredThreadsComponent,
        IgnoredCategoriesComponent,
        EmailComponent,
        NicknameComponent
    ],
    providers: [
        UsercpGroupsService,
        UsercpSignatureService,
        UsercpAvatarService,
        UsercpPostBitService,
        UsercpSocialNetworksService,
        UsercpNotificationSettingsService,
        UsercpThreadSubscriptionsService,
        UsercpCategorySubscriptionsService,
        UsercpIgnoredCategoriesResolver,
        UsercpIgnoredThreadsResolver,
        UsercpEmailService
    ],
    exports: [
        RouterModule
    ]
})
export class UsercpModule {
}
