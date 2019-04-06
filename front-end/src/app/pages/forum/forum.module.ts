import { FixedToolsModule } from 'shared/components/fixed-tools/fixed-tools.module';
import { FormsModule } from '@angular/forms';
import { ThreadControllerResolver } from './services/thread-controller.resolver';
import { ThreadControllerComponent } from './category/thread-controller/thread-controller.component';
import { EditorModule } from 'shared/components/editor/editor.module';
import { PostComponent } from './post/post.component';
import { ThreadService } from './services/thread.service';
import { ThreadComponent } from './thread/thread.component';
import { PaginationModule } from 'shared/app-views/pagination/pagination.module';
import { UserProfileModule } from 'shared/directives/user-profile.module';
import { SlimThreadComponent } from './slim-thread/slim-thread.component';
import { CategoryResolver } from './services/category.resolver';
import { CategoryComponent } from './category/category.component';
import { SlimCategoryComponent } from './slim-category/slim-category.component';
import { CommonModule } from '@angular/common';
import { ForumHomeResolver } from './services/forum-home.resolver';
import { forumRoutes } from './forum.routes';
import { RouterModule } from '@angular/router';
import { ForumHomeComponent } from './forum-home/forum-home.component';
import { ContentModule } from 'shared/app-views/content/content.module';
import { PageModule } from 'shared/page/page.module';
import { NgModule } from '@angular/core';
import { TitleModule } from 'shared/app-views/title/title.module';
import { ButtonModule } from 'shared/directives/button/button.module';
import { LazyLoadModule } from 'shared/directives/lazy-load/lazy-load.module';
import { SortingComponent } from './category/sorting/sorting.component';
import { SafeHtmlModule } from 'shared/pipes/safe-html/safe-html.module';
import { SafeStyleModule } from 'shared/pipes/safe-style/safe-style.module';
import { ReportComponent } from './post/report/report.component';
import { PostService } from './services/post.service';
import { ThreadPollComponent } from './thread/thread-poll/thread-poll.component';
import { ChangeOwnerComponent } from './thread/change-owner/change-owner.component';
import { MoveThreadComponent } from './thread/move-thread/move-thread.component';
import { EditHistoryComponent } from './thread/edit-history/edit-history.component';
import { InfractionModule } from 'shared/components/infraction/infraction.module';
import { LatestPostsResolver } from './services/latest-posts.resolver';
import { LatestPostsComponent } from './latest-posts/latest-posts.component';
import { LatestThreadsResolver } from './services/latest-threads.resolver';
import { LatestThreadsComponent } from './latest-threads/latest-threads.component';
import { ThreadPostersComponent } from './thread/thread-posters/thread-posters.component';
import { TableModule } from 'shared/components/table/table.module';
import { UserLinkModule } from 'shared/components/user/user-link.module';

@NgModule({
    imports: [
        RouterModule.forChild(forumRoutes),
        PageModule,
        ContentModule,
        TitleModule,
        CommonModule,
        UserProfileModule,
        PaginationModule,
        EditorModule,
        FormsModule,
        FixedToolsModule,
        ButtonModule,
        LazyLoadModule,
        SafeHtmlModule,
        SafeStyleModule,
        InfractionModule,
        TableModule,
        UserLinkModule
    ],
    declarations: [
        ForumHomeComponent,
        SlimCategoryComponent,
        CategoryComponent,
        SlimThreadComponent,
        ThreadComponent,
        PostComponent,
        ThreadControllerComponent,
        SortingComponent,
        ReportComponent,
        ThreadPollComponent,
        ChangeOwnerComponent,
        MoveThreadComponent,
        EditHistoryComponent,
        LatestPostsComponent,
        LatestThreadsComponent,
        ThreadPostersComponent
    ],
    providers: [
        ForumHomeResolver,
        CategoryResolver,
        ThreadService,
        ThreadControllerResolver,
        PostService,
        LatestPostsResolver,
        LatestThreadsResolver
    ],
    entryComponents: [
        ReportComponent,
        ChangeOwnerComponent,
        MoveThreadComponent,
        EditHistoryComponent,
        ThreadPostersComponent
    ],
    exports: []
})

export class ForumModule {
}
