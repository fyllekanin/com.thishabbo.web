import { Component, ComponentFactoryResolver, ElementRef, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { TitleTab } from 'shared/app-views/title/title.model';
import { Page } from 'shared/page/page.model';
import { USERCP_BREADCRUM_ITEM } from '../../usercp.constants';
import {
    BarColorModel,
    NamePositionModel,
    PostBitActions,
    PostBitInformation,
    PostBitModel,
    SlimBadge
} from './post-bit.model';
import { PostBitService } from '../services/post-bit.service';
import { DialogService } from 'core/services/dialog/dialog.service';
import { BadgesComponent } from './badges/badges.component';
import { DialogButton, DialogCloseButton } from 'shared/app-views/dialog/dialog.model';
import { NAME_POSITIONS } from 'shared/constants/name-positions.constants';
import { StringHelper } from 'shared/helpers/string.helper';
import { UserHelper } from 'shared/helpers/user.helper';

@Component({
    selector: 'app-usercp-post-bit',
    templateUrl: 'post-bit.component.html'
})
export class PostBitComponent extends Page implements OnDestroy {
    private _postBitModel: PostBitModel;

    userBarColors = '';
    namePositions: Array<{ label: string, value: number }> = [];
    tabs: Array<TitleTab> = [
        new TitleTab({title: 'Save', value: PostBitActions.SAVE}),
        new TitleTab({title: 'Change Badges', value: PostBitActions.ADD_BADGE})
    ];

    constructor (
        private _dialogService: DialogService,
        private _service: PostBitService,
        private _componentResolver: ComponentFactoryResolver,
        elementRef: ElementRef,
        activatedRoute: ActivatedRoute,
        breadcrumbService: BreadcrumbService
    ) {
        super(elementRef);
        this.addSubscription(activatedRoute.data, this.onData.bind(this));
        this.namePositions = Object.keys(NAME_POSITIONS).map(key => ({
            label: StringHelper.prettifyString(key),
            value: NAME_POSITIONS[key]
        }));
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: 'PostBit',
            items: [
                USERCP_BREADCRUM_ITEM
            ]
        });
    }

    ngOnDestroy (): void {
        super.destroy();
    }

    onAction (action: number): void {
        if (action === PostBitActions.SAVE) {
            this._service.save(this._postBitModel);
        } else {
            this._dialogService.openDialog({
                title: 'Badges',
                component: this._componentResolver.resolveComponentFactory(BadgesComponent),
                data: [].concat(this._postBitModel.information.badges),
                buttons: [
                    new DialogCloseButton('Close'),
                    new DialogButton({
                        title: 'Done',
                        callback: this.onSelectedBadges.bind(this)
                    })
                ]
            });
        }
    }

    getBarColors (): string {
        return UserHelper.getBarColor(this._postBitModel.barColor.color);
    }

    onBarColorChange (colors): void {
        const arr = colors.split(',').filter(item => Boolean(item))
            .map(item => item.trim());
        this._postBitModel.barColor.color = arr.length > 0 ? arr : null;
    }

    get postBitOptions (): PostBitInformation {
        return this._postBitModel ? this._postBitModel.information : new PostBitInformation({});
    }

    get badges (): Array<SlimBadge> {
        return this._postBitModel ? this._postBitModel.information.badges : [];
    }

    get namePosition (): NamePositionModel {
        return this._postBitModel.namePosition ? this._postBitModel.namePosition : new NamePositionModel(null);
    }

    get userBar (): BarColorModel {
        return this._postBitModel.barColor ? this._postBitModel.barColor : new BarColorModel(null);
    }

    private onData (data: { data: PostBitModel }): void {
        this._postBitModel = data.data;
        this.userBarColors = this._postBitModel.barColor && this._postBitModel.barColor.isAvailable ?
            this._postBitModel.barColor.color.toString() : '';
    }

    private onSelectedBadges (badges: Array<SlimBadge>): void {
        this._postBitModel.information.badges = badges;
        this._dialogService.closeDialog();
    }
}
