import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Followers, ProfileActions, ProfileModel, ProfileRelations, ProfileStats } from './profile.model';
import { Page } from 'shared/page/page.model';
import { ActivatedRoute } from '@angular/router';
import { TimeHelper } from 'shared/helpers/time.helper';
import { SlimUser } from 'core/services/auth/auth.model';
import { TitleTab } from 'shared/app-views/title/title.model';
import { AuthService } from 'core/services/auth/auth.service';
import { ProfileService } from './profile.service';
import { NotificationService } from 'core/services/notification/notification.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { Activity } from 'core/services/continues-information/continues-information.model';
import { EditorAction } from 'shared/components/editor/editor.model';

@Component({
    selector: 'app-user-profile',
    templateUrl: 'profile.component.html',
    styleUrls: ['profile.component.css']
})
export class ProfileComponent extends Page implements OnDestroy {
    private _data: ProfileModel;

    sendButton: Array<EditorAction> = [
        new EditorAction({title: 'Send Message'})
    ];
    followerTabs: Array<TitleTab> = [];

    constructor (
        private _authService: AuthService,
        private _profileService: ProfileService,
        private _notificationService: NotificationService,
        private _sanitizer: DomSanitizer,
        elementRef: ElementRef,
        activatedRoute: ActivatedRoute,
        breadcrumbService: BreadcrumbService
    ) {
        super(elementRef);
        this.addSubscription(activatedRoute.data, this.onData.bind(this));
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: `${activatedRoute.snapshot.params['nickname']}'s profile`
        });
    }

    ngOnDestroy (): void {
        super.destroy();
    }

    onFollowerTabClick (action: number): void {
        switch (action) {
            case ProfileActions.FOLLOW:
                this.followUser();
                break;
            case ProfileActions.UNFOLLOW:
                this.unfollowUser();
                break;
        }
    }

    get activities (): Array<Activity> {
        return this._data.activities;
    }

    get isPrivate (): boolean {
        return !Boolean(this._data.stats);
    }

    get followers (): Followers {
        return this._data.followers;
    }

    get user (): SlimUser {
        return this._data.user;
    }

    get coverPhotoData (): { userId: number, version: number } {
        return {userId: this._data.user.userId, version: this._data.user.avatarUpdatedAt};
    }

    get avatar (): string {
        return `/rest/resources/images/users/${this._data.user.userId}.gif?${this._data.user.avatarUpdatedAt}`;
    }

    get joined (): string {
        const date = new Date(this._data.stats.createdAt * 1000);
        return `${TimeHelper.FULL_MONTHS[date.getMonth()]} ${date.getFullYear()}`;
    }

    get stats (): ProfileStats {
        return this._data.stats;
    }

    get youtube (): SafeResourceUrl {
        return this._data.youtube ? this._sanitizer.bypassSecurityTrustResourceUrl(this._data.youtube) : null;
    }

    get relations (): ProfileRelations {
        return this._data.relations;
    }

    private followUser (): void {
        this._profileService.follow(this._data.user.userId)
            .subscribe(res => {
                this._notificationService.sendInfoNotification(`You have now followed!`);
                this._data.followers = new Followers(res);
                this.setFollowerTabs();
            }, this._notificationService.failureNotification.bind(this._notificationService));
    }

    private unfollowUser (): void {
        this._profileService.unfollow(this._data.user.userId)
            .subscribe(res => {
                this._notificationService.sendInfoNotification(`You have now unfollowed!`);
                this._data.followers = new Followers(res);
                this.setFollowerTabs();
            }, this._notificationService.failureNotification.bind(this._notificationService));
    }

    private onData (data: { data: ProfileModel }): void {
        this._data = data.data;
        this.setFollowerTabs();
    }

    private setFollowerTabs (): void {
        if (!this._authService.isLoggedIn() || this._authService.authUser.userId === this._data.user.userId) {
            return;
        }

        if (this._data.followers.isFollowing) {
            this.followerTabs = this._data.followers.isApproved ?
                [new TitleTab({title: 'Unfollow', value: ProfileActions.UNFOLLOW})] :
                [new TitleTab({title: 'Pending..'})];
        } else {
            this.followerTabs = [
                new TitleTab({title: 'Follow', value: ProfileActions.FOLLOW})
            ];
        }
    }
}
