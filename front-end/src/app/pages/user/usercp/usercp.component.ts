import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { SideMenuBlock, SideMenuItem } from 'shared/app-views/side-menu/side-menu.model';
import { AuthService } from 'core/services/auth/auth.service';

@Component({
    selector: 'app-usercp',
    template: `
    <div class="grid-container">
        <div class="grid-x margin-x">
            <div class="cell small-12 position-relative">
                <app-cover-photo-with-avatar [userId]="userId" [version]="version"></app-cover-photo-with-avatar>
            </div>
            <div class="cell small-12 medium-9 position-relative">
                <router-outlet></router-outlet>
            </div>
            <div class="cell small-12 medium-3">
                <app-side-menu [blocks]="blocks"></app-side-menu>
            </div>
        </div>
    </div>`
})


export class UsercpComponent extends Page implements OnDestroy, OnInit {

    blocks: Array<SideMenuBlock> = [];
    version = new Date().getTime();

    constructor(
        private _authService: AuthService,
        breadcrumbService: BreadcrumbService,
        elementRef: ElementRef
    ) {
        super(elementRef);
        breadcrumbService.breadcrumb = new Breadcrumb({ current: 'UserCP' });
    }

    ngOnInit(): void {
        this.blocks = [
            new SideMenuBlock({
                title: 'Account',
                items: [
                    new SideMenuItem({ title: 'Account Overview', link: '/user/usercp' }),
                    new SideMenuItem({ title: 'Edit Nickname', link: '/user/usercp/account/nickname' }),
                    new SideMenuItem({ title: 'Groups', link: '/user/usercp/account/groups' }),
                    new SideMenuItem({ title: 'Change Password', link: '/user/usercp/account/password' }),
                    new SideMenuItem({ title: 'Edit Habbo', link: '/user/usercp/account/habbo' }),
                    new SideMenuItem({ title: 'Edit Home Page', link: '/user/usercp/account/home-page' }),
                    new SideMenuItem({ title: 'Edit Theme', link: '/user/usercp/account/theme' }),
                    new SideMenuItem({ title: 'Claim Voucher Code', link: '/user/usercp/account/voucher-code' }),
                    new SideMenuItem({ title: 'Follower Management', link: '/user/usercp/account/followers/page/1' }),
                    new SideMenuItem({ title: 'Notifications', link: '/user/usercp/account/notifications/page/1' })
                ]
            }),
            new SideMenuBlock({
                title: 'Essentials',
                items: [
                    new SideMenuItem({ title: 'Edit Profile Settings', link: '/user/usercp/essentials/profile' }),
                    new SideMenuItem({ title: 'Edit Signature', link: '/user/usercp/essentials/signature' }),
                    new SideMenuItem({ title: 'Edit Avatar', link: '/user/usercp/essentials/avatar' }),
                    new SideMenuItem({ title: 'Edit Cover Photo', link: '/user/usercp/essentials/cover' }),
                    new SideMenuItem({ title: 'Edit Postbit', link: '/user/usercp/essentials/post-bit' }),
                    new SideMenuItem({ title: 'Edit Social Networks', link: '/user/usercp/essentials/social-networks' })
                ]
            }),
            new SideMenuBlock({
                title: 'Subscriptions & Notifications',
                items: [
                    new SideMenuItem({ title: 'Edit Notification Settings', link: '/user/usercp/subscriptions/notification-settings' }),
                    new SideMenuItem({ title: 'Edit Thread Subscriptions', link: '/user/usercp/subscriptions/thread-subscriptions' }),
                    new SideMenuItem({ title: 'Edit Category Subscriptions', link: '/user/usercp/subscriptions/category-subscriptions' }),
                    new SideMenuItem({ title: 'Edit Ignored Threads', link: '/user/usercp/subscriptions/ignored-threads' }),
                    new SideMenuItem({ title: 'Edit Ignored Categories', link: '/user/usercp/subscriptions/ignored-categories' })
                ]
            })
        ];
    }

    ngOnDestroy(): void {
        super.destroy();
    }

    get userId(): number {
        return this._authService.isLoggedIn() ? this._authService.authUser.userId : 0;

    }
}
