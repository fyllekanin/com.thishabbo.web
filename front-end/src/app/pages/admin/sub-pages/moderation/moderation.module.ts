import { PostsModerationComponent } from './posts/posts-moderation.component';
import { PostsModerationResolver } from './services/posts-moderation.resolver';
import { ThreadsModerationComponent } from './threads/threads-moderation.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ContentModule } from 'shared/app-views/content/content.module';
import { TitleModule } from 'shared/app-views/title/title.module';
import { PaginationModule } from 'shared/app-views/pagination/pagination.module';
import { TableModule } from 'shared/components/table/table.module';
import { PageModule } from 'shared/page/page.module';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { moderationRoutes } from './moderation.routes';
import { ThreadsModerationResolver } from './services/threads-moderation.resolver';
import { GroupsModerationComponent } from './groups/groups-moderation.component';
import { GroupsModerationResolver } from './services/groups-moderation.resolver';
import { PollsListService } from './services/polls-list.service';
import { ListComponent } from './polls/list/list.component';
import { PollResolver } from './services/poll.resolver';
import { PollComponent } from './polls/poll/poll.component';
import { AutoBansService } from './services/auto-bans.service';
import { AutoBansListComponent } from './auto-bans/list/auto-bans-list.component';
import { AutoBanComponent } from './auto-bans/auto-ban/auto-ban.component';
import { AutoBanService } from './services/auto-ban.service';
import { InfractionLevelsService } from './services/infraction-levels.service';
import { InfractionLevelsListComponent } from './infraction-levels/list/infraction-levels-list.component';
import { InfractionLevelComponent } from './infraction-levels/infraction-level/infraction-level.component';
import { InfractionLevelService } from './services/infraction-level.service';
import { InfractionsResolver } from './services/infractions.resolver';
import { InfractionsComponent } from './infractions/infractions.component';
import { BansComponent } from './bans/bans.component';
import { BansPageService } from './services/bans.service';
import { ReasonModule } from 'shared/components/reason/reason.module';

@NgModule({
    imports: [
        RouterModule.forChild(moderationRoutes),
        PageModule,
        TableModule,
        PaginationModule,
        TitleModule,
        ContentModule,
        CommonModule,
        FormsModule,
        ReasonModule
    ],
    declarations: [
        ThreadsModerationComponent,
        PostsModerationComponent,
        GroupsModerationComponent,
        ListComponent,
        PollComponent,
        AutoBansListComponent,
        AutoBanComponent,
        InfractionLevelsListComponent,
        InfractionLevelComponent,
        InfractionsComponent,
        BansComponent
    ],
    providers: [
        ThreadsModerationResolver,
        PostsModerationResolver,
        GroupsModerationResolver,
        PollsListService,
        PollResolver,
        AutoBansService,
        AutoBanService,
        InfractionLevelsService,
        InfractionLevelService,
        InfractionsResolver,
        BansPageService
    ],
    exports: [
        RouterModule
    ]
})
export class ModerationModule {}
