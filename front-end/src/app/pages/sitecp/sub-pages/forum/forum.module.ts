import { ButtonModule } from 'shared/directives/button/button.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ContentModule } from 'shared/app-views/content/content.module';
import { PaginationModule } from 'shared/app-views/pagination/pagination.module';
import { TitleModule } from 'shared/app-views/title/title.module';
import { FixedToolsModule } from 'shared/components/fixed-tools/fixed-tools.module';
import { TableModule } from 'shared/components/table/table.module';
import { PageModule } from 'shared/page/page.module';
import { CategoryComponent } from './category/category.component';
import { forumRoutes } from './forum.routes';
import { CategoriesListComponent } from './list/categories-list.component';
import { PermissionsComponent } from './permissions/permissions.component';
import { PrefixListComponent } from './prefixes/prefix-list/prefix-list.component';
import { PrefixComponent } from './prefixes/prefix/prefix.component';
import { CategoriesListResolver } from './services/categories-list.resolver';
import { CategoryResolver } from './services/category.resolver';
import { PermissionsResolver } from './services/permissions.resolver';
import { PrefixListResolver } from './services/prefix-list.resolver';
import { PrefixService } from './services/prefix.resolver';
import { SafeHtmlModule } from 'shared/pipes/safe-html/safe-html.module';
import { SelectModule } from 'shared/components/form/select/select.module';
import { GroupTreeResolver } from './services/group-tree.resolver';
import { GroupTreeComponent } from './group-tree/group-tree.component';
import { TreeDiagramModule } from 'shared/components/graph/tree-diagram/tree-diagram.module';
import { ThreadTemplateListComponent } from './thread-templates/thread-template-list/thread-template-list.component';
import { ThreadTemplateComponent } from './thread-templates/thread-template/thread-template.component';
import { EditorModule } from 'shared/components/editor/editor.module';
import { ThreadTemplateService } from './services/thread-template.service';
import { ThreadTemplateListResolver } from './services/thread-template-list.resolver';
import { MergeCategoryComponent } from './list/merge-category/merge-category.component';

@NgModule({
    imports: [
        RouterModule.forChild(forumRoutes),
        PageModule,
        TableModule,
        PaginationModule,
        TitleModule,
        ContentModule,
        FormsModule,
        CommonModule,
        FixedToolsModule,
        ButtonModule,
        SafeHtmlModule,
        SelectModule,
        TreeDiagramModule,
        EditorModule
    ],
    declarations: [
        CategoriesListComponent,
        CategoryComponent,
        PermissionsComponent,
        PrefixListComponent,
        PrefixComponent,
        GroupTreeComponent,
        ThreadTemplateListComponent,
        ThreadTemplateComponent,
        MergeCategoryComponent
    ],
    providers: [
        CategoriesListResolver,
        CategoryResolver,
        PermissionsResolver,
        PrefixListResolver,
        PrefixService,
        GroupTreeResolver,
        ThreadTemplateService,
        ThreadTemplateListResolver
    ],
    entryComponents: [
        MergeCategoryComponent
    ],
    exports: [
        RouterModule
    ]
})
export class ForumModule {
}
