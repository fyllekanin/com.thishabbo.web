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
import { UserProfileModule } from 'shared/directives/user-profile.module';

@NgModule({
    imports: [
        CommonModule,
        SafeHtmlModule,
        SafeStyleModule,
        UserProfileModule,
        RouterModule
    ],
    declarations: [
        BadgeViewComponent,
        CategoryViewComponent,
        ThreadViewComponent,
        InfractionViewComponent,
        FollowerViewComponent
    ],
    exports: [
        BadgeViewComponent,
        CategoryViewComponent,
        ThreadViewComponent,
        InfractionViewComponent,
        FollowerViewComponent
    ]
})
export class NotificationViewsModule {}
