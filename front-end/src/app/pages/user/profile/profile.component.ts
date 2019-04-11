import { Component, ElementRef, OnDestroy } from '@angular/core';
import { ProfileModel, ProfileStats } from './profile.model';
import { Page } from 'shared/page/page.model';
import { ActivatedRoute } from '@angular/router';
import { TimeHelper } from 'shared/helpers/time.helper';
import { SlimUser } from 'core/services/auth/auth.model';

@Component({
    selector: 'app-user-profile',
    templateUrl: 'profile.component.html',
    styleUrls: ['profile.component.css']
})
export class ProfileComponent extends Page implements OnDestroy {
    private _data: ProfileModel;

    constructor(
        elementRef: ElementRef,
        activatedRoute: ActivatedRoute
    ) {
        super(elementRef);
        this.addSubscription(activatedRoute.data, this.onData.bind(this));
    }

    ngOnDestroy(): void {
        super.destroy();
    }

    get user(): SlimUser {
        return this._data.user;
    }

    get coverPhotoData(): { userId: number, version: number } {
        return { userId: this._data.user.userId, version: this._data.user.avatarUpdatedAt };
    }

    get avatar(): string {
        return `/rest/resources/images/users/${this._data.user.userId}.gif?${this._data.user.avatarUpdatedAt}`;
    }

    get joined(): string {
        const date = new Date(this._data.stats.createdAt * 1000);
        return `${TimeHelper.FULL_MONTHS[date.getMonth()]} ${date.getFullYear()}`;
    }

    get stats(): ProfileStats {
        return this._data.stats;
    }

    private onData(data: { data: ProfileModel }): void {
        this._data = data.data;
    }
}
