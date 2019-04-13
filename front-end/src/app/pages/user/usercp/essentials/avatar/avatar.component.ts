import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { TitleTab } from 'shared/app-views/title/title.model';
import { Page } from 'shared/page/page.model';
import { ActivatedRoute } from '@angular/router';
import { USERCP_BREADCRUM_ITEM } from '../../usercp.constants';
import { AvatarService } from '../services/avatar.service';
import { UsercpAvatarCoverPreviewService } from '../../../cover/usercp-avatar-cover-preview.service';
import { NotificationMessage, NotificationType } from 'shared/app-views/global-notification/global-notification.model';
import { NotificationService } from 'core/services/notification/notification.service';

@Component({
    selector: 'app-usercp-avatar',
    templateUrl: 'avatar.component.html'
})
export class AvatarComponent extends Page implements OnDestroy {
    private _avatarSize: { height: number; width: number; } = { height: 200, width: 200 };

    @ViewChild('avatar') avatarInput;
    tabs: Array<TitleTab> = [
        new TitleTab({ title: 'Save' })
    ];

    constructor(
        private _service: AvatarService,
        private _previewService: UsercpAvatarCoverPreviewService,
        private _notificationService: NotificationService,
        activatedRoute: ActivatedRoute,
        elementRef: ElementRef,
        breadcrumbService: BreadcrumbService
    ) {
        super(elementRef);
        this._previewService.show();
        this.addSubscription(activatedRoute.data, this.onData.bind(this));
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: 'Avatar',
            items: [
                USERCP_BREADCRUM_ITEM
            ]
        });
    }

    ngOnDestroy(): void {
        super.destroy();
        this._previewService.hide();
    }

    onSave(): void {
        const form = new FormData();
        const file = this.avatarInput.nativeElement.files ? this.avatarInput.nativeElement.files[0] : null;
        form.append('avatar', file);
        this._service.save(form)
            .subscribe(() => {
                this._previewService.update();
            }, error => {
                this._notificationService.sendNotification(new NotificationMessage({
                    title: 'Failure',
                    message: error.error.errors.avatar[0],
                    type: NotificationType.ERROR
                }));
            });
    }

    get avatarSize(): { height: number; width: number; } {
        return this._avatarSize;
    }

    private onData(data: { data: { height: number; width: number; } }): void {
        this._avatarSize = data.data;
    }
}
