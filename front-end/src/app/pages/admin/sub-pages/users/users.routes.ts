import { UserService } from './services/user.service';
import { BasicComponent } from './basic/basic.component';
import { UsersListService } from './services/users-list.service';
import { UsersListComponent } from './list/users-list.component';
import { PageComponent } from 'shared/page/page.component';
import { Routes } from '@angular/router';
import { GroupsComponent } from './groups/groups.component';
import { GroupsService } from './services/groups.service';
import { BanComponent } from './ban/ban.component';
import { BanService } from './services/ban.service';
import { ThcRequestsService } from './services/thc-requests.service';
import { ThcRequestsComponent } from './thc-requests/thc-requests.component';
import { IpSearchComponent } from './ip-search/ip-search.component';
import { ContinuesInformationService } from 'core/services/continues-information/continues-information.service';
import { PING_TYPES } from 'core/services/continues-information/continues-information.model';
import { VoucherCodesComponent } from './voucher-codes/voucher-codes.component';
import { VoucherCodesResolver } from './services/voucher-codes.resolver';

export const usersRoutes: Routes = [
    {
        path: '',
        component: PageComponent,
        children: [
            {
                path: '',
                redirectTo: 'page/1'
            },
            {
                path: 'page/:page',
                component: UsersListComponent,
                resolve: {
                    data: UsersListService
                }
            },
            {
                path: 'thc/requests',
                component: ThcRequestsComponent,
                resolve: {
                    data: ThcRequestsService
                }
            },
            {
                path: ':userId/basic',
                component: BasicComponent,
                resolve: {
                    data: UserService
                }
            },
            {
                path: ':userId/groups',
                component: GroupsComponent,
                resolve: {
                    data: GroupsService
                }
            },
            {
                path: ':userId/bans',
                component: BanComponent,
                resolve: {
                    data: BanService
                }
            },
            {
                path: 'ip-search',
                component: IpSearchComponent,
                resolve: {
                    ping: ContinuesInformationService
                },
                data: {
                    type: PING_TYPES.STAFF
                }
            },
            {
                path: 'voucher-codes/page/:page',
                component: VoucherCodesComponent,
                resolve: {
                    data: VoucherCodesResolver
                }
            }
        ]
    }
];
