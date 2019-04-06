import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { Group, GroupsModel } from './groups.model';
import { ActivatedRoute } from '@angular/router';
import { TitleTab } from 'shared/app-views/title/title.model';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { SITECP_BREADCRUMB_ITEM, USER_LIST_BREADCRUMB_ITEM } from '../../../admin.constants';
import { ArrayHelper } from 'shared/helpers/array.helper';
import { GroupsService } from '../services/groups.service';

@Component({
    selector: 'app-admin-users-groups',
    templateUrl: 'groups.component.html'
})
export class GroupsComponent extends Page implements OnDestroy {
    private _groupsModel: GroupsModel = new GroupsModel();

    tabs: Array<TitleTab> = [
        new TitleTab({ title: 'Save' }),
        new TitleTab({ title: 'Cancel', link: '/admin/users/page/1' })
    ];

    constructor(
        private _service: GroupsService,
        breadcrumbService: BreadcrumbService,
        elementRef: ElementRef,
        activatedRoute: ActivatedRoute
    ) {
        super(elementRef);
        this.addSubscription(activatedRoute.data, this.onData.bind(this));
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: 'Editing User',
            items: [
                SITECP_BREADCRUMB_ITEM,
                USER_LIST_BREADCRUMB_ITEM
            ]
        });
    }

    ngOnDestroy(): void {
        super.destroy();
    }

    onSave(): void {
        const groupIds = this._groupsModel.groups.map(group => group.groupId);
        const displayGroupId = this._groupsModel.displayGroupId || 0;
        this._service.updateUsersGroups(groupIds, displayGroupId, this._groupsModel.userId);
    }

    getHalfOfPossibleGroups(first: boolean): Array<Group> {
        return this._groupsModel.possibleGroups.filter((_group, index) => Boolean(index % 2) === first);
    }

    toggleGroup(group: Group): void {
        if (this.haveUserGroup(group)) {
            this._groupsModel.groups = this._groupsModel.groups.filter(grp => grp.groupId !== group.groupId);
        } else {
            this._groupsModel.groups.push(group);
        }
    }

    haveUserGroup(group: Group): boolean {
        return this._groupsModel.groups.findIndex(grp => grp.groupId === group.groupId) > -1;
    }

    get nickname(): string {
        return this._groupsModel.nickname;
    }

    get displayGroup(): number {
        return this._groupsModel.displayGroupId;
    }

    set displayGroup(group: number) {
        this._groupsModel.displayGroupId = group;
    }

    get availableGroups(): Array<Group> {
        return this._groupsModel.groups;
    }

    private onData(data: { data: GroupsModel }): void {
        this._groupsModel = data.data;
        this._groupsModel.possibleGroups = this._groupsModel.possibleGroups.sort(ArrayHelper.sortByPropertyDesc.bind(this, 'name'));
    }
}
