import { Component, ElementRef, OnDestroy } from '@angular/core';
import { ProfileModel, ProfileStats } from './profile.model';
import { Page } from 'shared/page/page.model';
import { ActivatedRoute } from '@angular/router';

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

    get coverPhotoData(): { userId: number, version: number } {
        return { userId: this._data.userId, version: this._data.avatarUpdatedAt };
    }

    get stats(): ProfileStats {
        return this._data.stats;
    }

    get nickname(): string {
        return this._data.nickname;
    }

    private onData(data: { data: ProfileModel }): void {
        this._data = data.data;
    }
}
