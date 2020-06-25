import { NotificationModel } from 'shared/app-views/top-bar/top-bar.model';
import { EventEmitter } from '@angular/core';

export interface NotificationView {
    notification: NotificationModel<any>;
    onClick: EventEmitter<number>;

    getTime (): string;
}

export function shouldPerformClickOnNotification (event) {
    return event && event.className.indexOf('readOnly') === -1 && event.nodeName !== 'A' && event.nodeName !== 'app-user-link';
}
