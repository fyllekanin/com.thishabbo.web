import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ContentModule } from 'shared/app-views/content/content.module';
import { TitleModule } from 'shared/app-views/title/title.module';
import { GroupResolver } from './services/group.resolver';
import { GroupComponent } from './group/group.component';
import { GroupsListResolver } from './services/groups-list.resolver';
import { GroupsListComponent } from './list/groups-list.component';
import { groupRoutes } from './groups.routes';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { PageModule } from 'shared/page/page.module';
import { TableModule } from 'shared/components/table/table.module';
import { PaginationModule } from 'shared/app-views/pagination/pagination.module';
import { SafeStyleModule } from 'shared/pipes/safe-style/safe-style.module';
import { ForumPermissionsComponent } from './forum-permissions/forum-permissions.component';
import { TreeDiagramModule } from 'shared/components/graph/tree-diagram/tree-diagram.module';
import { ForumPermissionsResolver } from './services/forum-permissions.resolver';

@NgModule({
    imports: [
        RouterModule.forChild(groupRoutes),
        PageModule,
        TableModule,
        PaginationModule,
        TitleModule,
        ContentModule,
        FormsModule,
        CommonModule,
        SafeStyleModule,
        TreeDiagramModule
    ],
    declarations: [
        GroupsListComponent,
        GroupComponent,
        ForumPermissionsComponent
    ],
    providers: [
        GroupsListResolver,
        GroupResolver,
        ForumPermissionsResolver
    ],
    exports: [
        RouterModule
    ]
})
export class GroupsModule {
}
