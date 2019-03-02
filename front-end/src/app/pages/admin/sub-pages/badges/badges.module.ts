import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ContentModule } from 'shared/app-views/content/content.module';
import { TitleModule } from 'shared/app-views/title/title.module';
import { BadgeResolver } from './services/badge.resolver';
import { BadgeComponent } from './badge/badge.component';
import { BadgesListResolver } from './services/badges-list.resolver';
import { BadgesListComponent } from './list/badges-list.component';
import { badgeRoutes } from './badges.routes';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { PageModule } from 'shared/page/page.module';
import { TableModule } from 'shared/components/table/table.module';
import { PaginationModule } from 'shared/app-views/pagination/pagination.module';
import { BadgeUsersResolver } from './services/badge-users.resolver';
import { BadgeUsersComponent } from './badge-users/badge-users.component';
import { ButtonModule } from 'shared/directives/button/button.module';
import { LazyLoadModule } from 'shared/directives/lazy-load/lazy-load.module';

@NgModule({
    imports: [
        RouterModule.forChild(badgeRoutes),
        PageModule,
        TableModule,
        PaginationModule,
        TitleModule,
        ContentModule,
        FormsModule,
        CommonModule,
        ButtonModule,
        LazyLoadModule
    ],
    declarations: [
        BadgesListComponent,
        BadgeComponent,
        BadgeUsersComponent
    ],
    providers: [
        BadgesListResolver,
        BadgeResolver,
        BadgeUsersResolver
    ],
    exports: [
        RouterModule
    ]
})
export class BadgesModule {
}
