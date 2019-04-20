import { Component, ComponentFactoryResolver, ElementRef, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { TitleTab } from 'shared/app-views/title/title.model';
import { Page } from 'shared/page/page.model';
import { USERCP_BREADCRUM_ITEM } from '../../usercp.constants';
import { PostBitActions, PostBitInformation, PostBitModel, SlimBadge } from './post-bit.model';
import { PostBitService } from '../services/post-bit.service';
import { DialogService } from 'core/services/dialog/dialog.service';
import { BadgesComponent } from './badges/badges.component';
import { DialogButton, DialogCloseButton } from 'shared/app-views/dialog/dialog.model';

@Component({
    selector: 'app-usercp-post-bit',
    templateUrl: 'post-bit.component.html'
})
export class PostBitComponent extends Page implements OnDestroy {
    private _postBitModel: PostBitModel;

    tabs: Array<TitleTab> = [
        new TitleTab({ title: 'Save', value: PostBitActions.SAVE }),
        new TitleTab({ title: 'Change Badges', value: PostBitActions.ADD_BADGE })
    ];

    constructor(
        private _dialogService: DialogService,
        private _service: PostBitService,
        private _componentResolver: ComponentFactoryResolver,
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

    onAction(action: number): void {
        if (action === PostBitActions.SAVE) {
            this._service.save(this._postBitModel);
        } else {
            this._dialogService.openDialog({
                title: 'Badges',
                component: this._componentResolver.resolveComponentFactory(BadgesComponent),
                data: [].concat(this._postBitModel.badges),
                buttons: [
                    new DialogCloseButton('Close'),
                    new DialogButton({
                        title: 'Done',
                        callback: this.onSelectedBadges.bind(this)
                    })
                ]
            })
        }
    }

    get postBitOptions(): PostBitInformation {
        return this._postBitModel ? this._postBitModel.information : new PostBitInformation({});
    }

    get badges(): Array<SlimBadge> {
        return this._postBitModel ? this._postBitModel.badges : [];
    }

    private onData(data: { data: PostBitModel }): void {
        this._postBitModel = data.data;
    }

    private onSelectedBadges(badges: Array<SlimBadge>): void {
        this._postBitModel.badges = badges;
        this._dialogService.closeDialog();
    }
}
