import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ContentModule } from 'shared/app-views/content/content.module';
import { UserService } from './services/user.service';
import { BasicComponent } from './basic/basic.component';
import { TitleModule } from 'shared/app-views/title/title.module';
import { PaginationModule } from 'shared/app-views/pagination/pagination.module';
import { TableModule } from 'shared/components/table/table.module';
import { usersRoutes } from './users.routes';
import { UsersListService } from './services/users-list.service';
import { UsersListComponent } from './list/users-list.component';
import { PageModule } from 'shared/page/page.module';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { GroupsComponent } from './groups/groups.component';
import { GroupsService } from './services/groups.service';
import { BanService } from './services/ban.service';
import { BanComponent } from './ban/ban.component';
import { ThcRequestsService } from './services/thc-requests.service';
import { ThcRequestsComponent } from './thc-requests/thc-requests.component';
import { IpSearchComponent } from './ip-search/ip-search.component';
import { MergeUsersComponent } from './list/merge-users/merge-users.component';
import { ReasonModule } from 'shared/components/reason/reason.module';
import { VoucherCodesResolver } from './services/voucher-codes.resolver';
import { VoucherCodesComponent } from './voucher-codes/voucher-codes.component';
import { VoucherCodeComponent } from './voucher-codes/voucher-code/voucher-code.component';
import { InfractionModule } from 'shared/components/infraction/infraction.module';
import { EssentialsComponent } from './essentials/essentials.component';
import { SafeHtmlModule } from 'shared/pipes/safe-html/safe-html.module';
import { EssentialsService } from './services/essentials.service';

@NgModule({
    imports: [
        RouterModule.forChild(usersRoutes),
        PageModule,
        TableModule,
        PaginationModule,
        TitleModule,
        ContentModule,
        CommonModule,
        FormsModule,
        ReasonModule,
        InfractionModule,
        SafeHtmlModule
    ],
    declarations: [
        UsersListComponent,
        BasicComponent,
        GroupsComponent,
        BanComponent,
        ThcRequestsComponent,
        MergeUsersComponent,
        IpSearchComponent,
        VoucherCodesComponent,
        VoucherCodeComponent,
        EssentialsComponent
    ],
    providers: [
        UsersListService,
        UserService,
        GroupsService,
        BanService,
        ThcRequestsService,
        VoucherCodesResolver,
        EssentialsService
    ],
    entryComponents: [
        MergeUsersComponent,
        VoucherCodeComponent
    ],
    exports: [
        RouterModule
    ]
})
export class UsersModule {
}
