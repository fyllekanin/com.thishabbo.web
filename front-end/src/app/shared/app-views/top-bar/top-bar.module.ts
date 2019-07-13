import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TopBarComponent } from 'shared/app-views/top-bar/top-bar.component';
import { ButtonModule } from 'shared/directives/button/button.module';
import { FormsModule } from '@angular/forms';
import { SafeHtmlModule } from 'shared/pipes/safe-html/safe-html.module';
import { SafeStyleModule } from 'shared/pipes/safe-style/safe-style.module';
import { UserProfileModule } from 'shared/directives/user-profile.module';
import { ContinuesInformationModule } from 'core/services/continues-information/continues-information.module';
import { NotificationViewsModule } from 'shared/components/notification-views/notification-views.module';
import { BreadcrumbModule } from '../breadcrumb/breadcrumb.module';
import { SearchBarModule } from '../search-bar/search-bar.module';

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
        UserProfileModule,
        NotificationViewsModule,
        BreadcrumbModule,
        SearchBarModule
    ],
    declarations: [
        TopBarComponent
    ],
    providers: [],
    exports: [
        TopBarComponent
    ]
})
export class TopBarModule {
}
