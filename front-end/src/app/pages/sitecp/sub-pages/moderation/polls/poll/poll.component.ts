import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { ActivatedRoute, Router } from '@angular/router';
import { PollAnswerModel, PollModel } from './poll.model';
import { TitleTab } from 'shared/app-views/title/title.model';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { POLL_LIST_BREADCRUMB_ITEM, SITECP_BREADCRUMB_ITEM } from '../../../../sitecp.constants';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';

@Component({
    selector: 'app-sitecp-moderation-poll',
    templateUrl: 'poll.component.html'
})
export class PollComponent extends Page implements OnDestroy {
    private _data: PollModel;

    tabs: Array<TitleTab> = [
        new TitleTab({ title: 'Back to list' })
    ];

    constructor (
        private _router: Router,
        elementRef: ElementRef,
        activatedRoute: ActivatedRoute,
        breadcrumbService: BreadcrumbService
    ) {
        super(elementRef);
        this.addSubscription(activatedRoute.data, this.onData.bind(this));
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: 'View Poll',
            items: [
                SITECP_BREADCRUMB_ITEM,
                POLL_LIST_BREADCRUMB_ITEM
            ]
        });
    }

    onBack (): void {
        this._router.navigateByUrl('/sitecp/moderation/polls/page/1');
    }

    ngOnDestroy (): void {
        this.destroy();
    }

    get question (): string {
        return this._data.question;
    }

    get answers (): Array<PollAnswerModel> {
        return this._data.answers;
    }

    private onData (data: { data: PollModel }): void {
        this._data = data.data;
    }
}
