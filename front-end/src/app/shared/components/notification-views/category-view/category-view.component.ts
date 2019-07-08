import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { NotificationView } from 'shared/components/notification-views/notification-views.model';
import { NotificationModel } from 'shared/app-views/top-bar/top-bar.model';
import { CategoryView } from 'app/shared/components/notification-views/category-view/category-view.model';
import { Router } from '@angular/router';
import { SlimUser } from 'core/services/auth/auth.model';

@Component({
    selector: 'app-top-bar-category-view',
    templateUrl: 'category-view.component.html',
    styleUrls: ['../notification.views.css']
})
export class CategoryViewComponent implements NotificationView {
    private _notification: NotificationModel<CategoryView>;

    @Output()
    onClick = new EventEmitter<number>();

    constructor (private _router: Router) {
    }

    @Input()
    set notification (notification: NotificationModel<CategoryView>) {
        this._notification = notification;
    }

    get user (): SlimUser {
        return this._notification.item.user;
    }

    get categoryTitle (): string {
        return this._notification.item.thread.categoryTitle;
    }

    get imagePath (): string {
        return `/rest/resources/images/users/${this.user.userId}.gif?${this.user.avatarUpdatedAt}`;
    }

    getTime (): string {
        return this._notification.createdAt;
    }

    @HostListener('click', ['$event.target'])
    click (event): void {
        this.onClick.next(this._notification.notificationId);
        if (event && event.className.indexOf('readOnly') === -1) {
            this._router.navigateByUrl(`/forum/thread/${this._notification.item.thread.threadId}/page/1`);
        }
    }
}
