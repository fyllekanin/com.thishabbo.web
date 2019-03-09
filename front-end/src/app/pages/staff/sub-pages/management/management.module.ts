import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ContentModule } from 'shared/app-views/content/content.module';
import { TitleModule } from 'shared/app-views/title/title.module';
import { PageModule } from 'shared/page/page.module';
import { managementRoutes } from './management.routes';
import { TableModule } from 'shared/components/table/table.module';
import { DoNotHireListComponent } from './do-not-hire/list/do-not-hire-list.component';
import { DoNotHireListResolver } from './services/do-not-hire-list.resolver';
import { DoNotHireComponent } from './do-not-hire/do-not-hire.component';
import { DoNotHireResolver } from './services/do-not-hire.resolver';
import { CurrentListenersResolver } from './services/current-listeners.resolver';
import { CurrentListenersComponent } from './current-listeners/current-listeners.component';
import {PermShowComponent} from './permshow/permshow.component';
import {PermShowsListComponent} from './permshow/list/permshows-list.component';
import {PermShowResolver} from './services/permshow.resolver';
import {PermShowsListResolver} from './services/permshows-list.resolver';
import {PaginationModule} from 'shared/app-views/pagination/pagination.module';

@NgModule({
    imports: [
        RouterModule.forChild(managementRoutes),
        PageModule,
        TitleModule,
        ContentModule,
        CommonModule,
        FormsModule,
        TableModule,
        PaginationModule
    ],
    declarations: [
        DoNotHireListComponent,
        DoNotHireComponent,
        CurrentListenersComponent,
        PermShowComponent,
        PermShowsListComponent
    ],
    providers: [
        DoNotHireListResolver,
        DoNotHireResolver,
        CurrentListenersResolver,
        PermShowResolver,
        PermShowsListResolver
    ],
    exports: [
        RouterModule
    ]
})
export class ManagementModule {
}
