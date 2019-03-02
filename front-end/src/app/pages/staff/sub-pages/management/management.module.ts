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

@NgModule({
    imports: [
        RouterModule.forChild(managementRoutes),
        PageModule,
        TitleModule,
        ContentModule,
        CommonModule,
        FormsModule,
        TableModule
    ],
    declarations: [
        DoNotHireListComponent,
        DoNotHireComponent,
        CurrentListenersComponent
    ],
    providers: [
        DoNotHireListResolver,
        DoNotHireResolver,
        CurrentListenersResolver
    ],
    exports: [
        RouterModule
    ]
})
export class ManagementModule {
}
