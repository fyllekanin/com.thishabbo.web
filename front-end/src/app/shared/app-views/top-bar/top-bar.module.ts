import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TopBarComponent } from 'shared/app-views/top-bar/top-bar.component';
import { ButtonModule } from 'shared/directives/button/button.module';
import { FormsModule } from '@angular/forms';
import { SafeHtmlModule } from 'shared/pipes/safe-html/safe-html.module';
import { SafeStyleModule } from 'shared/pipes/safe-style/safe-style.module';
import { UserProfileModule } from 'shared/directives/user-profile.module';
import { BadgeViewComponent } from 'shared/app-views/top-bar/notification-views/badge-view/badge-view.component';
import { CategoryViewComponent } from 'shared/app-views/top-bar/notification-views/category-view/category-view.component';
import { ThreadViewComponent } from 'shared/app-views/top-bar/notification-views/thread-view/thread-view.component';
import { InfractionViewComponent } from 'shared/app-views/top-bar/notification-views/infraction-view/infraction-view.component';
import { ContinuesInformationModule } from 'core/services/continues-information/continues-information.module';

@NgModule({
    imports: [
        ContinuesInformationModule.forRoot(),
        RouterModule,
        CommonModule,
        RouterModule,
        ButtonModule,
        FormsModule,
        SafeHtmlModule,
        SafeStyleModule,
        UserProfileModule
    ],
    declarations: [
        TopBarComponent,
        BadgeViewComponent,
        CategoryViewComponent,
        ThreadViewComponent,
        InfractionViewComponent
    ],
    providers: [],
    exports: [
        TopBarComponent
    ]
})
export class TopBarModule {
}
