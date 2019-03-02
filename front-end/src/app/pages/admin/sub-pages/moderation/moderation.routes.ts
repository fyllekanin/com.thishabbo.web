import { ThreadsModerationComponent } from './threads/threads-moderation.component';
import { PageComponent } from 'shared/page/page.component';
import { Routes } from '@angular/router';
import { ThreadsModerationResolver } from './services/threads-moderation.resolver';
import { PostsModerationResolver } from './services/posts-moderation.resolver';
import { PostsModerationComponent } from './posts/posts-moderation.component';
import { GroupsModerationComponent } from './groups/groups-moderation.component';
import { GroupsModerationResolver } from './services/groups-moderation.resolver';
import { PollsListService } from './services/polls-list.service';
import { ListComponent } from './polls/list/list.component';
import { PollComponent } from './polls/poll/poll.component';
import { PollResolver } from './services/poll.resolver';
import { AutoBansListComponent } from './auto-bans/list/auto-bans-list.component';
import { AutoBansService } from './services/auto-bans.service';
import { AutoBanComponent } from './auto-bans/auto-ban/auto-ban.component';
import { AutoBanService } from './services/auto-ban.service';
import { InfractionLevelsListComponent } from './infraction-levels/list/infraction-levels-list.component';
import { InfractionLevelsService } from './services/infraction-levels.service';
import { InfractionLevelComponent } from './infraction-levels/infraction-level/infraction-level.component';
import { InfractionLevelService } from './services/infraction-level.service';
import { InfractionsComponent } from './infractions/infractions.component';
import { InfractionsResolver } from './services/infractions.resolver';
import { BansComponent } from './bans/bans.component';
import { BansPageService } from './services/bans.service';

export const moderationRoutes: Routes = [
    {
        path: '',
        component: PageComponent,
        children: [
            {
                path: '',
                redirectTo: 'threads'
            },
            {
                path: 'threads',
                component: ThreadsModerationComponent,
                resolve: {
                    data: ThreadsModerationResolver
                }
            },
            {
                path: 'posts',
                component: PostsModerationComponent,
                resolve: {
                    data: PostsModerationResolver
                }
            },
            {
                path: 'groups',
                component: GroupsModerationComponent,
                resolve: {
                    data: GroupsModerationResolver
                }
            },
            {
                path: 'polls/page/:page',
                component: ListComponent,
                resolve: {
                    data: PollsListService
                }
            },
            {
                path: 'polls/:threadId',
                component: PollComponent,
                resolve: {
                    data: PollResolver
                }
            },
            {
                path: 'auto-bans/page/:page',
                component: AutoBansListComponent,
                resolve: {
                    data: AutoBansService
                }
            },
            {
                path: 'auto-bans/:autoBanId',
                component: AutoBanComponent,
                resolve: {
                    data: AutoBanService
                }
            },
            {
                path: 'infraction-levels/page/:page',
                component: InfractionLevelsListComponent,
                resolve: {
                    data: InfractionLevelsService
                }
            },
            {
                path: 'infraction-levels/:infractionLevelId',
                component: InfractionLevelComponent,
                resolve: {
                    data: InfractionLevelService
                }
            },
            {
                path: 'infractions/page/:page',
                component: InfractionsComponent,
                resolve: {
                    data: InfractionsResolver
                }
            },
            {
                path: 'bans/page/:page',
                component: BansComponent,
                resolve: {
                    data: BansPageService
                }
            }
        ]
    }
];
