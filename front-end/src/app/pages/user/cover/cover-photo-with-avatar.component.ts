import { Component, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { UsercpAvatarCoverPreviewService } from './usercp-avatar-cover-preview.service';

@Component({
    selector: 'app-cover-photo-with-avatar',
    templateUrl: 'cover-photo-with-avatar.component.html',
    styleUrls: ['cover-photo-with-avatar.component.css']
})
export class CoverPhotoWithAvatarComponent implements OnDestroy {
    private _subscriptions: Array<Subscription> = [];

    @Input() isVisible = false;
    @Input() userId: number;
    @Input() version: number;
    @Input() hideAvatar = false;

    constructor (service: UsercpAvatarCoverPreviewService) {
        this._subscriptions.push(service.onShow.subscribe(() => {
            this.isVisible = true;
        }));
        this._subscriptions.push(service.onHide.subscribe(() => {
            this.isVisible = false;
        }));
        this._subscriptions.push(service.onUpdate.subscribe(() => {
            this.version = new Date().getTime();
        }));
    }

    ngOnDestroy (): void {
        this._subscriptions.forEach(sub => {
            sub.unsubscribe();
        });
    }

    get avatar (): string {
        return `/rest/resources/images/users/${this.userId}.gif?${this.version}`;
    }

    get cover (): string {
        return `/rest/resources/images/covers/${this.userId}.gif?${this.version}`;
    }
}
