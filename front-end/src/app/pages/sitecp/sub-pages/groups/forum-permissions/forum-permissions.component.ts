import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { GROUP_LIST_BREADCRUMB_ITEM, SITECP_BREADCRUMB_ITEM } from '../../../sitecp.constants';
import { TreeDiagram } from 'shared/components/graph/tree-diagram/tree-diagram.model';
import { TitleTab } from 'shared/app-views/title/title.model';

@Component({
    selector: 'app-sitecp-groups-forum-permissions',
    templateUrl: 'forum-permissions.component.html'
})
export class ForumPermissionsComponent extends Page implements OnDestroy {
    tabs: Array<TitleTab> = [
        new TitleTab({ title: 'Back', link: '/sitecp/groups/page/1' })
    ];
    data: TreeDiagram;

    constructor (
        elementRef: ElementRef,
        activatedRoute: ActivatedRoute,
        breadcrumbService: BreadcrumbService
    ) {
        super(elementRef);
        this.addSubscription(activatedRoute.data, this.onData.bind(this));
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: 'Forum Permissions',
            items: [
                SITECP_BREADCRUMB_ITEM,
                GROUP_LIST_BREADCRUMB_ITEM
            ]
        });
    }

    ngOnDestroy () {
        super.destroy();
    }

    get title (): string {
        return `${this.data.name}: Forum Permissions`;
    }

    private onData (data: { data: TreeDiagram }): void {
        this.data = data.data;
    }
}
