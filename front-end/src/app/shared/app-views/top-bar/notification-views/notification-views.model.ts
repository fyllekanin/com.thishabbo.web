import { NotificationModel } from 'shared/app-views/top-bar/top-bar.model';
import { EventEmitter } from '@angular/core';

export interface NotificationView {
    notification: NotificationModel<any>;
    onClick: EventEmitter<number>;

    getTime(): string;
}
