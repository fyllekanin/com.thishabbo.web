import { NgModule } from '@angular/core';
import { BadgeViewComponent } from 'shared/components/notification-views/badge-view/badge-view.component';
import { CategoryViewComponent } from 'shared/components/notification-views/category-view/category-view.component';
import { ThreadViewComponent } from 'shared/components/notification-views/thread-view/thread-view.component';
import { InfractionViewComponent } from 'shared/components/notification-views/infraction-view/infraction-view.component';
import { FollowerViewComponent } from 'shared/components/notification-views/follower-view/follower-view.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SafeHtmlModule } from 'shared/pipes/safe-html/safe-html.module';
import { SafeStyleModule } from 'shared/pipes/safe-style/safe-style.module';
import { UserProfileModule } from 'shared/directives/user-profile/user-profile.module';
import { VisitorMessageViewComponent } from 'shared/components/notification-views/visitor-message-view/visitor-message-view.component';
import { UserViewComponent } from 'shared/components/notification-views/user-view/user-view.component';
import { UserLinkModule } from 'shared/components/user/user-link.module';

@NgModule({
    imports: [
        CommonModule,
        SafeHtmlModule,
        SafeStyleModule,
        UserProfileModule,
        RouterModule,
        UserLinkModule
    ],
    declarations: [
        BadgeViewComponent,
        CategoryViewComponent,
        ThreadViewComponent,
        InfractionViewComponent,
        FollowerViewComponent,
        VisitorMessageViewComponent,
        UserViewComponent
    ],
    exports: [
        BadgeViewComponent,
        CategoryViewComponent,
        ThreadViewComponent,
        InfractionViewComponent,
        FollowerViewComponent,
        VisitorMessageViewComponent,
        UserViewComponent
    ]
})
export class NotificationViewsModule {
}
