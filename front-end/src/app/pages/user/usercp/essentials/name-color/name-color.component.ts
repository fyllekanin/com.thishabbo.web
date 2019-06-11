import { TitleTab } from 'shared/app-views/title/title.model';
import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { NotificationService } from 'core/services/notification/notification.service';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { USERCP_BREADCRUM_ITEM } from '../../usercp.constants';
import { NameColor } from './name-color.model';
import { NameColorService } from '../services/name-color.service';
import { ActivatedRoute } from '@angular/router';
import { UserHelper } from 'shared/helpers/user.helper';
import { AuthService } from 'core/services/auth/auth.service';
import { INFO_BOX_TYPE, InfoBoxModel } from 'shared/app-views/info-box/info-box.model';

@Component({
    selector: 'app-usercp-name-color',
    templateUrl: 'name-color.component.html'
})
export class NameColorComponent extends Page implements OnDestroy {
    private _data: NameColor = new NameColor();

    tabs: Array<TitleTab> = [
        new TitleTab({title: 'Save'})
    ];

    infoModel: InfoBoxModel = {
        title: 'Warning!',
        type: INFO_BOX_TYPE.WARNING,
        content: `You do not have the permissions to update your name color. Click here to purchase a subscription to do this!`
    };

    constructor (
        private _service: NameColorService,
        private _notificationService: NotificationService,
        private _authService: AuthService,
        activatedRoute: ActivatedRoute,
        elementRef: ElementRef,
        breadcrumbService: BreadcrumbService
    ) {
        super(elementRef);
        this.addSubscription(activatedRoute.data, this.onData.bind(this));
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: 'Name Color',
            items: [
                USERCP_BREADCRUM_ITEM
            ]
        });
    }

    ngOnDestroy (): void {
        super.destroy();
    }

    onSave (): void {
        if (this.isColorsValid()) {
            this._service.save(this._data.colors).subscribe(() => {
                this._notificationService.sendInfoNotification('Name Color Updated');
            }, this._notificationService.failureNotification.bind(this._notificationService));
        } else {
            this._notificationService.sendErrorNotification('Hex codes invalid');
        }
    }

    get name (): string {
        return this._authService.authUser.nickname;
    }

    get nameStyle (): string {
        return UserHelper.getNameColor(this._data.colors);
    }

    get colors (): string {
        return this._data.colors.join(',');
    }

    get canUpdateColor (): boolean {
        return this._data.canUpdateColor;
    }

    set colors (colors: string) {
        this._data.colors = colors.split(',')
            .map(item => item.trim());
    }

    private onData (data: { data: NameColor }): void {
        this._data = data.data;
    }

    private isColorsValid (): boolean {
        const regex = /^#[0-9a-fA-F]{3}(?:[0-9a-fA-F]{3})?$/;
        return this._data.colors.every(color => regex.test(color));
    }
}
