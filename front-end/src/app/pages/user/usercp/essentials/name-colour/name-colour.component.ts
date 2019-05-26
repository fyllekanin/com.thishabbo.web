import { TitleTab } from 'shared/app-views/title/title.model';
import { Component, OnDestroy, ElementRef } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { NotificationService } from 'core/services/notification/notification.service';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { USERCP_BREADCRUM_ITEM } from '../../usercp.constants';
import { NameColour } from './name-colour.model';
import { NameColourService } from '../services/name-colour.service';
import { ActivatedRoute } from '@angular/router';
import { UserHelper } from 'shared/helpers/user.helper';
import { AuthService } from 'core/services/auth/auth.service';
import { InfoBoxModel, INFO_BOX_TYPE } from 'shared/app-views/info-box/info-box.model';

@Component({
    selector: 'app-usercp-name-colour',
    templateUrl: 'name-colour.component.html'
})
export class NameColourComponent extends Page implements OnDestroy {
    private _data: NameColour = new NameColour();

    tabs: Array<TitleTab> = [
        new TitleTab({ title: 'Save' })
    ];

    infoModel: InfoBoxModel = {
        title: 'Warning!',
        type: INFO_BOX_TYPE.WARNING,
        content: `You do not have the permissions to update your name colour. Click here to purchase a subscription to do this!`
    };

    constructor(
        private _service: NameColourService,
        private _notificationService: NotificationService,
        private _authService: AuthService,
        activatedRoute: ActivatedRoute,
        elementRef: ElementRef,
        breadcrumbService: BreadcrumbService
    ) {
        super(elementRef);
        this.addSubscription(activatedRoute.data, this.onData.bind(this));
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: 'Name Colour',
            items: [
                USERCP_BREADCRUM_ITEM
            ]
        });
    }

    ngOnDestroy(): void {
        super.destroy();
    }

    onSave(): void {
        if (this.validate()) {
            this._service.save(this._data.colours).subscribe(() => {
                    this._notificationService.sendInfoNotification('Name Colour Updated');
                }, this._notificationService.failureNotification.bind(this._notificationService));
        } else {
            this._notificationService.sendErrorNotification('Hex codes invalid');
        }
    }

    private validate () {
        const regex = /^#[0-9a-f]{3}(?:[0-9a-f]{3})?$/;
        return this._data.colours.every(colour => regex.test(colour));
    }

    get name (): string {
        return this._authService.authUser.nickname;
    }

    get nameStyle(): string {
        return UserHelper.getNameColour(this._data.colours);
    }

    get colours (): string {
        return this._data.colours.join(',');
    }

    get canUpdateColour (): boolean {
        return this._data.canUpdateColour;
    }

    set colours (colours: string) {
        this._data.colours = colours.split(',');
    }

    private onData(data: { data: NameColour }): void {
        this._data = data.data;
    }
}
