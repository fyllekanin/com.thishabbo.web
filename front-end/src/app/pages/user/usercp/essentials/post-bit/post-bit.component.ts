import { Component, ElementRef, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { TitleTab } from 'shared/app-views/title/title.model';
import { Page } from 'shared/page/page.model';
import { USERCP_BREADCRUM_ITEM } from '../../usercp.constants';
import { PostBitModel } from './post-bit.model';
import { PostBitService } from '../services/post-bit.service';

@Component({
    selector: 'app-usercp-post-bit',
    templateUrl: 'post-bit.component.html'
})
export class PostBitComponent extends Page implements OnDestroy {
    private _postBitModel: PostBitModel = new PostBitModel();

    tabs: Array<TitleTab> = [
        new TitleTab({ title: 'Save' })
    ];

    constructor(
        private _service: PostBitService,
        elementRef: ElementRef,
        activatedRoute: ActivatedRoute,
        breadcrumbService: BreadcrumbService
    ) {
        super(elementRef);
        this.addSubscription(activatedRoute.data, this.onData.bind(this));
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: 'PostBit',
            items: [
                USERCP_BREADCRUM_ITEM
            ]
        });
    }

    ngOnDestroy(): void {
        super.destroy();
    }

    onSave(): void {
        this._service.save(this._postBitModel);
    }

    get postBitOptions(): PostBitModel {
        return this._postBitModel || new PostBitModel();
    }

    private onData(data: { data: PostBitModel }): void {
        this._postBitModel = data.data;
    }
}
