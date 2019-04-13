import { NotificationService } from 'core/services/notification/notification.service';
import { Subscription } from 'rxjs';
import { NotificationMessage, NotificationType } from 'shared/app-views/global-notification/global-notification.model';
import { AfterViewInit, Component, ElementRef, NgZone, OnDestroy, ViewChild, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'app-global-notification',
    templateUrl: 'global-notification.component.html',
    styleUrls: ['global-notification.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class GlobalNotificationComponent implements AfterViewInit, OnDestroy {
    private _notificationSubscription: Subscription;
    private _wrapperElement: HTMLDivElement;

    @ViewChild('wrapper') wrapper: ElementRef;

    constructor(
        private _ngZone: NgZone,
        notificationService: NotificationService
    ) {
        this._notificationSubscription = notificationService.onNotification.subscribe(this.onNotification.bind(this));
    }

    ngAfterViewInit(): void {
        this._wrapperElement = this.wrapper.nativeElement;
    }

    ngOnDestroy(): void {
        this._notificationSubscription.unsubscribe();
    }

    private onNotification(notification: NotificationMessage): void {
        const node = this.createElement(notification);
        this._wrapperElement.appendChild(node);
    }

    private createElement(notification: NotificationMessage): Node {
        const node = document.createElement('div');
        node.className = `global-notification ${this.getType(notification)}`;

        this._ngZone.runOutsideAngular(() => {
            setTimeout(this.dismissNotification.bind(this, node), notification.timeout);
        });

        const title = document.createElement('div');
        title.className = 'global-notification-title';
        title.textContent = notification.title;

        const message = document.createElement('div');
        message.className = 'global-notification-message';
        message.textContent = notification.message;

        const dismiss = document.createElement('i');
        dismiss.className = 'global-notification-dismiss fa fa-times-circle';
        dismiss.addEventListener('click', this.dismissNotification.bind(this, node));

        node.appendChild(title);
        node.appendChild(message);
        node.appendChild(dismiss);

        return node;
    }

    private dismissNotification(node: HTMLElement): void {
        node.className = node.className + ' global-notification-hidden';
        setTimeout(() => {
            node.style.display = 'none';
            node.remove();
        }, 2100);
    }

    private getType(notification: NotificationMessage): string {
        switch (notification.type) {
            case NotificationType.INFO:
                return 'global-notification-info';
            case NotificationType.WARNING:
                return 'global-notification-warning';
            case NotificationType.SUCCESS:
                return 'global-notification-success';
            case NotificationType.ERROR:
            default:
                return 'global-notification-error';
        }
    }
}
