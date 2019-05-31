import { TitleTab } from 'shared/app-views/title/title.model';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { NotificationMessage } from 'shared/app-views/global-notification/global-notification.model';
import { NotificationService } from 'core/services/notification/notification.service';
import { HttpService } from 'core/services/http/http.service';
import { DialogService } from 'core/services/dialog/dialog.service';
import { ActivatedRoute } from '@angular/router';
import { Notice } from 'shared/components/notice/notice.model';
import { Component } from '@angular/core';
import { SITECP_BREADCRUMB_ITEM, WEBSITE_SETTINGS_BREADCRUMB_ITEM } from '../../../admin.constants';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';

@Component({
    selector: 'app-admin-notice-board',
    templateUrl: 'notice-board.component.html',
    styleUrls: ['notice-board.component.css']
})
export class NoticeBoardComponent {
    private _notices: Array<Notice> = [];

    tabs: Array<TitleTab> = [
        new TitleTab({
            title: 'Create',
            link: '/admin/website-settings/notice-board/create'
        }),
        new TitleTab({
            title: 'Back',
            link: '/admin/website-settings'
        })
    ];

    constructor (
        private _httpService: HttpService,
        private _notificationService: NotificationService,
        private _dialogService: DialogService,
        breadcrumbService: BreadcrumbService,
        activatedRoute: ActivatedRoute
    ) {
        activatedRoute.data.subscribe(data => {
            this._notices = data.data;
        });
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: 'Manage Noticeboard',
            items: [
                SITECP_BREADCRUMB_ITEM,
                WEBSITE_SETTINGS_BREADCRUMB_ITEM
            ]
        });
    }

    deleteNotice (notice: Notice): void {
        this._dialogService.confirm({
            title: `Deleting notice`,
            content: `Are you sure that you want to delete the notice ${notice.title}?`,
            callback: this.onDelete.bind(this, notice)
        });
    }

    moveDown (noticeId: number): void {
        const noti = this._notices.find(notice => notice.noticeId === noticeId);
        const newOrder = noti.order + 1;
        const noticeWithOrder = this._notices.find(notice => notice.order === newOrder);
        noti.order = newOrder;
        noticeWithOrder.order -= 1;
        this.updateOrder();
    }

    moveUp (noticeId): void {
        const noti = this._notices.find(notice => notice.noticeId === noticeId);
        const newOrder = noti.order - 1;
        const noticeWithOrder = this._notices.find(notice => notice.order === newOrder);
        noti.order = newOrder;
        noticeWithOrder.order += 1;
        this.updateOrder();
    }

    get notices (): Array<Notice> {
        return this._notices.sort((a, b) => {
            if (a.order > b.order) {
                return 1;
            } else if (a.order < b.order) {
                return -1;
            }
            return 0;
        });
    }

    private updateOrder (): void {
        this._httpService.put('admin/content/notices', {notices: this._notices}).subscribe(() => {
            this._notificationService.sendNotification(new NotificationMessage({
                title: 'Success!',
                message: 'Notice order updated'
            }));
        }, this._notificationService.failureNotification.bind(this._notificationService));
    }

    private onDelete (notice: Notice): void {
        this._httpService.delete(`admin/content/notices/${notice.noticeId}`)
            .subscribe(this.onSuccessDelete.bind(this, notice),
                this._notificationService.failureNotification.bind(this._notificationService), () => {
                    this._dialogService.closeDialog();
                });
    }

    private onSuccessDelete (notice: Notice): void {
        this._notices = this._notices.filter(noti => noti.noticeId !== notice.noticeId);
        this._notificationService.sendNotification(new NotificationMessage({
            title: 'Success!',
            message: 'Notice got deleted!'
        }));
    }
}
