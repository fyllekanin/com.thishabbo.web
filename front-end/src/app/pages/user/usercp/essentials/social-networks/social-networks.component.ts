import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { ActivatedRoute } from '@angular/router';
import { NotificationService } from 'core/services/notification/notification.service';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { USERCP_BREADCRUM_ITEM } from '../../usercp.constants';
import { SocialNetworksModel } from './social-networks.model';
import { NotificationModel, NotificationType } from 'shared/app-views/global-notification/global-notification.model';
import { TitleTab } from 'shared/app-views/title/title.model';
import { SocialNetworksService } from '../services/social-networks.service';

@Component({
    selector: 'app-usercp-social-networks',
    templateUrl: 'social-networks.component.html'
})
export class SocialNetworksComponent extends Page implements OnDestroy {
    private _data: SocialNetworksModel = new SocialNetworksModel();

    tabs: Array<TitleTab> = [
        new TitleTab({ title: 'Save' })
    ];

    constructor(
        private _notificationService: NotificationService,
        private _service: SocialNetworksService,
        elementRef: ElementRef,
        breadcrumbService: BreadcrumbService,
        activatedRoute: ActivatedRoute
    ) {
        super(elementRef);
        this.addSubscription(activatedRoute.data, this.onData.bind(this));
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: 'Social Networks',
            items: [
                USERCP_BREADCRUM_ITEM
            ]
        });
    }

    ngOnDestroy(): void {
        super.destroy();
    }

    update(): void {
        if (!this.valuesAreValid) {
            this._notificationService.sendNotification(new NotificationModel({
                title: 'Error',
                message: 'One or more are not having correct format',
                type: NotificationType.ERROR
            }));
            return;
        }

        this._service.save(this._data);
    }

    get model(): SocialNetworksModel {
        return this._data;
    }

    private onData(data: { data: SocialNetworksModel }): void {
        this._data = data.data;
    }

    private valuesAreValid(): boolean {
        const discordIsValid = this._data.discord &&
            new RegExp(/^((.+?)#\d{4})/).test(this._data.discord);

        const twitterIsValid = this._data.twitter &&
            new RegExp(/^@?(\w){1,15}$/).test(this._data.twitter);
        return discordIsValid && twitterIsValid;
    }
}
