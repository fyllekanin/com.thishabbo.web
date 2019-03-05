import { Routes } from '@angular/router';
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
import { HomePageComponent } from './home-page/home-page.component';
import { SocialNetworksComponent } from './social-networks/social-networks.component';
import { UsercpSocialNetworksService } from './services/usercp-social-networks.service';
import { NotificationSettingsComponent } from './notification-settings/notification-settings.component';
import { UsercpNotificationSettingsService } from './services/usercp-notification-settings.service';
import { ThreadSubscriptionsComponent } from './thread-subscriptions/thread-subscriptions.component';
import { UsercpThreadSubscriptionsService } from './services/usercp-thread-subscriptions.service';
import { CategorySubscriptionsComponent } from './category-subscriptions/category-subscriptions.component';
import { UsercpCategorySubscriptionsService } from './services/usercp-category-subscriptions.service';
import { CoverPhotoComponent } from './cover-photo/cover-photo.component';
import { IgnoredThreadsComponent } from './ignored-threads/ignored-threads.component';
import { UsercpIgnoredThreadsResolver } from './services/usercp-ignored-threads.resolver';
import { UsercpIgnoredCategoriesResolver } from './services/usercp-ignored-categories.resolver';
import { IgnoredCategoriesComponent } from './ignored-categories/ignored-categories.component';
import { EmailComponent } from './email/email.component';
import { UsercpEmailService } from './services/usercp-email.service';
import { NicknameComponent } from './nickname/nickname.component';

export const usercpRoutes: Routes = [
    {
        path: '',
        component: UsercpComponent,
        children: [
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
                path: 'signature',
                component: SignatureComponent,
                resolve: {
                    data: UsercpSignatureService
                }
            },
            {
                path: 'password',
                component: PasswordComponent
            },
            {
                path: 'avatar',
                component: AvatarComponent,
                resolve: {
                    data: UsercpAvatarService
                }
            },
            {
                path: 'cover',
                component: CoverPhotoComponent
            },
            {
                path: 'post-bit',
                component: PostBitComponent,
                resolve: {
                    data: UsercpPostBitService
                }
            },
            {
                path: 'home-page',
                component: HomePageComponent
            },
            {
                path: 'social-networks',
                component: SocialNetworksComponent,
                resolve: {
                    data: UsercpSocialNetworksService
                }
            },
            {
                path: 'notification-settings',
                component: NotificationSettingsComponent,
                resolve: {
                    data: UsercpNotificationSettingsService
                }
            },
            {
                path: 'thread-subscriptions',
                component: ThreadSubscriptionsComponent,
                resolve: {
                    data: UsercpThreadSubscriptionsService
                }
            }
            ,
            {
                path: 'category-subscriptions',
                component: CategorySubscriptionsComponent,
                resolve: {
                    data: UsercpCategorySubscriptionsService
                }
            },
            {
                path: 'ignored-threads',
                component: IgnoredThreadsComponent,
                resolve: {
                    data: UsercpIgnoredThreadsResolver
                }
            },
            {
                path: 'ignored-categories',
                component: IgnoredCategoriesComponent,
                resolve: {
                    data: UsercpIgnoredCategoriesResolver
                }
            },
            {
                path: 'email',
                component: EmailComponent,
                resolve: {
                    data: UsercpEmailService
                }
            },
            {
                path: 'nickname',
                component: NicknameComponent
            }
        ]
    }
];
