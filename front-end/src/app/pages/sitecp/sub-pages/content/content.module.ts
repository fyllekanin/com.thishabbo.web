import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ContentModule } from 'shared/app-views/content/content.module';
import { TitleModule } from 'shared/app-views/title/title.module';
import { EditorModule } from 'shared/components/editor/editor.module';
import { SelectModule } from 'shared/components/form/select/select.module';
import { NoticeModule } from 'shared/components/notice/notice.module';
import { TableModule } from 'shared/components/table/table.module';
import { ButtonModule } from 'shared/directives/button/button.module';
import { PageModule } from 'shared/page/page.module';
import { BBcodeComponent } from './bbcodes/bbcode/bbcode.component';
import { BBcodesListComponent } from './bbcodes/list/bbcodes-list.component';
import { contentRoutes } from './content.routes';
import { GroupsListComponent } from './groups-list/groups-list.component';
import { BBcodeResolver } from './services/bbcode.resolver';
import { BBcodesListResolver } from './services/bbcodes-list.resolver';
import { GroupsListResolver } from './services/groups-list.resolver';

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
export class SitecpContentModule { }
