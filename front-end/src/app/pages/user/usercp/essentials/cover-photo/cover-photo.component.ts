import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { TitleTab } from 'shared/app-views/title/title.model';
import { Page } from 'shared/page/page.model';
import { USERCP_BREADCRUM_ITEM } from '../../usercp.constants';
import { NotificationMessage } from 'shared/app-views/global-notification/global-notification.model';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from 'core/services/notification/notification.service';
import { UsercpAvatarCoverPreviewService } from '../../../cover/usercp-avatar-cover-preview.service';

@Component({
    selector: 'app-usercp-cover',
    templateUrl: 'cover-photo.component.html'
})
export class CoverPhotoComponent extends Page implements OnDestroy {
    @ViewChild('cover', { static: true }) coverInput;
    tabs: Array<TitleTab> = [
        new TitleTab({ title: 'Save' })
    ];

    constructor(
        private _httpClient: HttpClient,
        private _notificationService: NotificationService,
        private _previewService: UsercpAvatarCoverPreviewService,
        elementRef: ElementRef,
        breadcrumbService: BreadcrumbService
    ) {
        super(elementRef);
        this._previewService.show();
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: 'Cover Photo',
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
        const file = this.coverInput.nativeElement.files ? this.coverInput.nativeElement.files[0] : null;
        form.append('cover', file);
        this._httpClient.post('rest/api/usercp/cover', form)
            .subscribe(() => {
                this._previewService.update();
                this._notificationService.sendNotification(new NotificationMessage({
                    title: 'Success',
                    message: 'Cover Photo Updated'
                }));
            }, error => {
                this._notificationService.sendNotification(new NotificationMessage({
                    title: 'Failure',
                    message: error.error.errors.cover[0]
                }));
            });
    }
}
