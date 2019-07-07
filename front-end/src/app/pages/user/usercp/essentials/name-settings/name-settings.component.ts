import { TitleTab } from 'shared/app-views/title/title.model';
import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { NotificationService } from 'core/services/notification/notification.service';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { USERCP_BREADCRUM_ITEM } from '../../usercp.constants';
import { NameSettings } from './name-settings.model';
import { ActivatedRoute } from '@angular/router';
import { UserHelper } from 'shared/helpers/user.helper';
import { AuthService } from 'core/services/auth/auth.service';
import { INFO_BOX_TYPE, InfoBoxModel } from 'shared/app-views/info-box/info-box.model';
import { ShopItem } from 'app/pages/sitecp/sub-pages/shop/items/items.model';
import { NameSettingsService } from '../services/name-settings.service';

@Component({
    selector: 'app-usercp-name-settings',
    templateUrl: 'name-settings.component.html',
    styleUrls: ['name-settings.component.css']
})
export class NameSettingsComponent extends Page implements OnDestroy {
    private _data: NameSettings = new NameSettings();

    tabs: Array<TitleTab> = [
        new TitleTab({title: 'Save'})
    ];

    colorInfoModel: InfoBoxModel = {
        title: 'Warning!',
        type: INFO_BOX_TYPE.WARNING,
        content: 'You do not have the permissions to update your name color!'
    };

    iconInfoModel: InfoBoxModel = {
        title: 'Warning!',
        type: INFO_BOX_TYPE.WARNING,
        content: 'You do not own any name icons!'
    };

    effectInfoModel: InfoBoxModel = {
        title: 'Warning!',
        type: INFO_BOX_TYPE.WARNING,
        content: 'You do not own any name effects!'
    };

    constructor (
        private _service: NameSettingsService,
        private _notificationService: NotificationService,
        private _authService: AuthService,
        activatedRoute: ActivatedRoute,
        elementRef: ElementRef,
        breadcrumbService: BreadcrumbService
    ) {
        super(elementRef);
        this.addSubscription(activatedRoute.data, this.onData.bind(this));
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: 'Name Settings',
            items: [
                USERCP_BREADCRUM_ITEM
            ]
        });
    }

    ngOnDestroy (): void {
        super.destroy();
    }

    onSave (): void {
        this._service.save(this._data).subscribe(() => {
            this._notificationService.sendInfoNotification('Name Settings Updated!');
        }, this._notificationService.failureNotification.bind(this._notificationService));
    }

    onNameIconSelect (icon: ShopItem) {
        this._data.iconId = icon.shopItemId;
    }

    isCurrentIcon (icon: ShopItem): boolean {
        return icon.shopItemId === this._data.iconId;
    }

    nameEffectStyle (effect: ShopItem): string {
        return `url(/rest/resources/images/shop/${effect.shopItemId}.gif)`;
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

    get canUpdateSettings (): boolean {
        return this._data.canUpdateSettings;
    }

    get availableNameIcons (): Array<ShopItem> {
        return this._data.availableNameIcons;
    }

    get availableNameEffects (): Array<ShopItem> {
        return this._data.availableNameEffects;
    }

    get iconPosition (): string {
        return this._data.iconPosition;
    }

    get effectId (): number {
        return this._data.effectId;
    }

    set effectId (id: number) {
        this._data.effectId = id;
    }

    set iconPosition (position: string) {
        this._data.iconPosition = position;
    }

    set colors (colors: string) {
        this._data.colors = colors.split(',')
            .map(item => item.trim());
    }

    private onData (data: { data: NameSettings }): void {
        this._data = data.data;
    }
}
