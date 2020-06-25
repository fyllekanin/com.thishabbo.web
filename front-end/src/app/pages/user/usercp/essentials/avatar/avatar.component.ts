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
import { AvatarModel } from './avatar.model';
import { DialogService } from 'core/services/dialog/dialog.service';
import { User } from 'core/services/auth/auth.model';

@Component({
    selector: 'app-usercp-avatar',
    templateUrl: 'avatar.component.html',
    styleUrls: [ 'avatar.component.css' ]
})
export class AvatarComponent extends Page implements OnDestroy {
    private _avatarSize = new AvatarModel(null);

    preview: string | ArrayBuffer;

    @ViewChild('avatar', { static: true }) avatarInput;
    tabs: Array<TitleTab> = [
        new TitleTab({ title: 'Save' })
    ];

    constructor (
        private _service: AvatarService,
        private _previewService: UsercpAvatarCoverPreviewService,
        private _notificationService: NotificationService,
        private _dialogService: DialogService,
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

    readURL (event): void {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];

            const reader = new FileReader();
            reader.onload = () => this.preview = reader.result;

            reader.readAsDataURL(file);
        }
    }

    ngOnDestroy (): void {
        super.destroy();
        this._previewService.hide();
    }

    onSave (): void {
        const form = new FormData();
        const file = this.avatarInput.nativeElement.files ? this.avatarInput.nativeElement.files[0] : null;
        form.append('avatar', file);
        if (this.model.resizeForMe) {
            form.append('resizeForMe', String(this.model.resizeForMe));
        }
        this._service.save(form)
            .subscribe(res => {
                this.onData({ data: res });
                this.preview = null;
                this.user.avatarUpdatedAt = new Date().getTime() / 1000;
                this._previewService.update();
            }, error => {
                this._notificationService.sendNotification(new NotificationMessage({
                    title: 'Failure',
                    message: error.error.errors.avatar[0],
                    type: NotificationType.ERROR
                }));
            });
    }

    onOldAvatar (id: number): void {
        this._dialogService.confirm({
            title: 'Avatar Modification',
            content: 'Are you sure you want to switch back to this Avatar?',
            callback: this.onSwitchBack.bind(this, id)
        });
    }

    getOldAvatarUrl (id: number): string {
        return `background-image: url('/resources/images/old-avatars/${id}.gif')`;
    }

    get model (): AvatarModel {
        return this._avatarSize;
    }

    get user (): User {
        return this._avatarSize.user;
    }

    private onSwitchBack (id: number): void {
        this._dialogService.closeDialog();
        this._service.switchBack(id).subscribe(res => {
            this.onData({ data: res });
            this._previewService.update();
        });
    }

    private onData (data: { data: AvatarModel }): void {
        this._avatarSize = data.data;
    }
}
