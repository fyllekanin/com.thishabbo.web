import { Component } from '@angular/core';
import { InnerDialogComponent } from 'shared/app-views/dialog/dialog.model';
import { SlimBadge } from '../post-bit.model';
import { HttpService } from 'core/services/http/http.service';
import { NotificationService } from 'core/services/notification/notification.service';

@Component({
    selector: 'app-usercp-post-bit-badges',
    templateUrl: 'badges.component.html',
    styleUrls: ['badges.component.css']
})
export class BadgesComponent extends InnerDialogComponent {
    private _selectedBadges: Array<SlimBadge> = [];

    badges: Array<SlimBadge> = [];

    constructor(
        private _httpService: HttpService,
        private _notificationService: NotificationService
    ) {
        super();
        this._httpService.get('usercp/badges')
            .subscribe(res => {
                this.badges = res.map(item => new SlimBadge(item));
            });
    }

    onToggle(badge: SlimBadge): void {
        console.log(badge);
        if (this.getIsActive(badge)) {
            this._selectedBadges = this._selectedBadges.filter(item => item.badgeId !== badge.badgeId);
            return;
        }

        if (this._selectedBadges.length === 3) {
            this._notificationService.sendErrorNotification('You can max have 3 badges selected!');
            return;
        }
        this._selectedBadges.push(badge);
    }

    getIsActive(badge: SlimBadge): boolean {
        return this._selectedBadges.findIndex(item => item.badgeId === badge.badgeId) > -1;
    }

    getData () {
        return this._selectedBadges;
    }

    setData (data: Array<SlimBadge>) {
        this._selectedBadges = data;
    }
}
