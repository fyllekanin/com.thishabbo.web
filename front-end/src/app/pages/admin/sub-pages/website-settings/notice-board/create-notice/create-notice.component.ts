import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Component, ViewChild } from '@angular/core';
import { Notice } from 'shared/components/notice/notice.model';
import { NotificationService } from 'core/services/notification/notification.service';
import { NotificationModel } from 'shared/app-views/global-notification/global-notification.model';
import { TitleTab } from 'shared/app-views/title/title.model';
import { Breadcrumb, BreadcrumbItem } from 'core/services/breadcrum/breadcrum.model';
import { SITECP_BREADCRUMB_ITEM, WEBSITE_SETTINGS_BREADCRUMB_ITEM } from '../../../../admin.constants';
import { NoticeBoardActions } from '../notice-board.model';


@Component({
    selector: 'app-admin-create-notice',
    templateUrl: 'create-notice.component.html'
})
export class CreateNoticeComponent {
    private _notice: Notice = new Notice();
    private _previewNotice: Notice;

    @ViewChild('file') fileInput;
    tabs: Array<TitleTab> = [
        new TitleTab({ title: 'Cancel', value: NoticeBoardActions.CANCEL}),
        new TitleTab({ title: 'Save', value: NoticeBoardActions.SAVE })
    ];

    constructor(
        private _httpClient: HttpClient,
        private _notificationService: NotificationService,
        private _router: Router,
        breadcrumbService: BreadcrumbService
    ) {
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: 'Creating Notice',
            items: [
                SITECP_BREADCRUMB_ITEM,
                WEBSITE_SETTINGS_BREADCRUMB_ITEM,
                new BreadcrumbItem({
                    title: 'Manage Noticeboard',
                    url: '/admin/content/notice-board'
                })
            ]
        });
    }

    onTabClick(value: number): void {
        switch (value) {
            case NoticeBoardActions.SAVE:
                this.save();
                break;
            case NoticeBoardActions.CANCEL:
                this.cancel();
                break;
        }
    }

    save(): void {
        const form = new FormData();
        const file = this.fileInput.nativeElement.files ? this.fileInput.nativeElement.files[0] : null;
        form.append('backgroundImage', file);
        form.append('notice', JSON.stringify(this._notice));

        this._httpClient.post('rest/api/admin/content/notices', form).subscribe(() => {
            this._notificationService.sendNotification(new NotificationModel({
                title: 'Success',
                message: `${this._notice.title} was created!`
            }));
            this.cancel();
        }, this._notificationService.failureNotification.bind(this._notificationService));
    }

    cancel(): void {
        this._router.navigateByUrl('/admin/content/notice-board');
    }

    onChange(): void {
        const text = (this._notice.text || '').replace(/\r?\n/g, '<br />');
        this._previewNotice = new Notice(this._notice);
        this._previewNotice.text = text;
    }

    onImage($event): void {
        const reader = new FileReader();
        reader.onload = () => {
            const newNotice = new Notice(this._notice);
            newNotice.backgroundImage = reader.result;
            this._notice = newNotice;
            this.onChange();
        };
        reader.readAsDataURL($event.target.files[0]);
    }

    get notice(): Notice {
        return this._notice;
    }

    get previewNotice(): Notice {
        return this._previewNotice;
    }

    get title(): string {
        return `Creating notice: ${this._notice.title}`;
    }
}
