import { EditorModule } from 'shared/components/editor/editor.module';
import { GroupsListResolver } from './services/groups-list.resolver';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { contentRoutes } from './content.routes';
import { PageModule } from 'shared/page/page.module';
import { TableModule } from 'shared/components/table/table.module';
import { TitleModule } from 'shared/app-views/title/title.module';
import { ContentModule } from 'shared/app-views/content/content.module';
import { NoticeModule } from 'shared/components/notice/notice.module';
import { BBcodesListResolver } from './services/bbcodes-list.resolver';
import { BBcodesListComponent } from './bbcodes/list/bbcodes-list.component';
import { BBcodeResolver } from './services/bbcode.resolver';
import { BBcodeComponent } from './bbcodes/bbcode/bbcode.component';
import { GroupsListComponent } from './groups-list/groups-list.component';
import { ButtonModule } from 'shared/directives/button/button.module';
import { SelectModule } from 'shared/components/form/select/select.module';

@NgModule({
    imports: [
        RouterModule.forChild(contentRoutes),
        PageModule,
        TableModule,
        TitleModule,
        ContentModule,
        CommonModule,
        FormsModule,
        NoticeModule,
        EditorModule,
        ButtonModule,
        SelectModule
    ],
    declarations: [
        BBcodesListComponent,
        BBcodeComponent,
        GroupsListComponent
    ],
    providers: [
        BBcodesListResolver,
        BBcodeResolver,
        GroupsListResolver
    ],
    exports: [
        RouterModule
    ]
})
export class AdminContentModule {}
