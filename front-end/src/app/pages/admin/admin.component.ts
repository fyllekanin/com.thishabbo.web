import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { Page } from 'shared/page/page.model';
import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { SideMenuBlock, SideMenuItem } from 'shared/app-views/side-menu/side-menu.model';
import { AuthService } from 'core/services/auth/auth.service';

@Component({
    selector: 'app-admin',
    template: `
        <div class="grid-container">
            <div class="grid-x margin-x">
                <div class="cell small-12 medium-9 position-relative">
                    <router-outlet></router-outlet>
                </div>
                <div class="cell small-12 medium-3">
                    <app-side-menu [blocks]="blocks"></app-side-menu>
                </div>
            </div>
        </div>`
})

export class AdminComponent extends Page implements OnDestroy, OnInit {
    blocks: Array<SideMenuBlock> = [];

    constructor (
        private _authService: AuthService,
        breadcrumbService: BreadcrumbService,
        elementRef: ElementRef
    ) {
        super(elementRef);
        breadcrumbService.breadcrumb = new Breadcrumb({current: 'AdminCP'});
    }

    ngOnInit (): void {
        this.blocks = [
            new SideMenuBlock({
                title: 'Content Management',
                items: [
                    new SideMenuItem({
                        title: 'Dashboard',
                        link: '/admin/dashboard'
                    }),
                    new SideMenuItem({
                        title: 'Server Logs',
                        link: '/admin/server-logs'
                    }),
                    new SideMenuItem({
                        title: 'Manage BBCode',
                        link: '/admin/content/bbcodes',
                        isApplicable: this._authService.adminPermissions.canManageBBcodes
                    }),
                    new SideMenuItem({
                        title: 'Manage Staff List',
                        link: '/admin/content/groups-list',
                        isApplicable: this._authService.adminPermissions.canManageGroupsList
                    }),
                    new SideMenuItem({
                        title: 'Website Settings',
                        link: '/admin/website-settings',
                        isApplicable: this._authService.adminPermissions.canEditWebsiteSettings
                    })
                ]
            }),
            new SideMenuBlock({
                title: 'Shop',
                items: [
                    new SideMenuItem({
                        title: 'Items',
                        link: '/admin/shop/items/page/1',
                        isApplicable: this._authService.adminPermissions.canManageShop
                    })
                ]
            }),
            new SideMenuBlock({
                title: 'Betting',
                items: [
                    new SideMenuItem({
                        title: 'Betting Categories',
                        link: '/admin/betting/categories/page/1',
                        isApplicable: this._authService.adminPermissions.canManageBetting
                    }),
                    new SideMenuItem({
                        title: 'Bets',
                        link: '/admin/betting/bets/page/1',
                        isApplicable: this._authService.adminPermissions.canManageBetting
                    })
                ]
            }),
            new SideMenuBlock({
                title: 'Forum Management',
                items: [
                    new SideMenuItem({
                        title: 'Manage Categories',
                        link: '/admin/forum/categories/page/1',
                        isApplicable: this._authService.adminPermissions.canManageForum
                    }),
                    new SideMenuItem({
                        title: 'Manage Prefixes',
                        link: '/admin/forum/prefixes',
                        isApplicable: this._authService.adminPermissions.canManagePrefixes
                    })
                ]
            }),
            new SideMenuBlock({
                title: 'Moderation',
                items: [
                    new SideMenuItem({
                        title: 'Manage Automatic Bans',
                        link: '/admin/moderation/auto-bans/page/1',
                        isApplicable: this._authService.adminPermissions.canManageInfractions
                    }),
                    new SideMenuItem({
                        title: 'Manage Infraction Levels',
                        link: '/admin/moderation/infraction-levels/page/1',
                        isApplicable: this._authService.adminPermissions.canManageInfractions
                    }),
                    new SideMenuItem({
                        title: 'Infractions',
                        link: '/admin/moderation/infractions/page/1',
                        isApplicable: this._authService.adminPermissions.canDoInfractions
                    }),
                    new SideMenuItem({
                        title: 'Moderate Threads',
                        link: '/admin/moderation/threads',
                        isApplicable: this._authService.adminPermissions.canModerateThreads
                    }),
                    new SideMenuItem({
                        title: 'Moderate Posts',
                        link: '/admin/moderation/posts',
                        isApplicable: this._authService.adminPermissions.canModeratePosts
                    }),
                    new SideMenuItem({
                        title: 'Moderate Group Applications',
                        link: '/admin/moderation/groups',
                        isApplicable: this._authService.adminPermissions.canApprovePublicGroups
                    }),
                    new SideMenuItem({
                        title: 'Manage Polls',
                        link: '/admin/moderation/polls/page/1',
                        isApplicable: this._authService.adminPermissions.canManagePolls
                    }),
                    new SideMenuItem({
                        title: 'Logs (user, staff, mod and admin)',
                        link: '/admin/moderation/logs/user/page/1',
                        isApplicable: this._authService.adminPermissions.canSeeLogs
                    })
                ]
            }),
            new SideMenuBlock({
                title: 'User Management',
                items: [
                    new SideMenuItem({
                        title: 'View Banned Users',
                        link: '/admin/moderation/bans/page/1',
                        isApplicable: this._authService.adminPermissions.canBanUser
                    }),
                    new SideMenuItem({
                        title: 'Manage Usergroups',
                        link: '/admin/groups/page/1',
                        isApplicable: this._authService.adminPermissions.canManageGroups
                    }),
                    new SideMenuItem({
                        title: 'Manage Users',
                        link: '/admin/users/page/1',
                        isApplicable: this.canManageUsers
                    }),
                    new SideMenuItem({
                        title: 'Manage Badges',
                        link: '/admin/badges/page/1',
                        isApplicable: this._authService.adminPermissions.canManageBadges
                    }),
                    new SideMenuItem({
                        title: 'Manage THC Requests',
                        link: '/admin/users/thc/requests',
                        isApplicable: this._authService.adminPermissions.canManageTHC
                    }),
                    new SideMenuItem({
                        title: 'Manage Voucher Codes',
                        link: '/admin/users/voucher-codes/page/1',
                        isApplicable: this._authService.adminPermissions.canManageTHC
                    }),
                    new SideMenuItem({
                        title: 'IP Address Search',
                        link: '/admin/users/ip-search',
                        isApplicable: this._authService.adminPermissions.canSeeIps
                    })
                ]
            }),
            new SideMenuBlock({
                title: 'Statistics',
                items: [
                    new SideMenuItem({
                        title: 'Users Logged In',
                        link: `/admin/statistics/users/${new Date().getFullYear()}/${new Date().getMonth() + 1}`
                    }),
                    new SideMenuItem({
                        title: 'Posts',
                        link: `/admin/statistics/posts/${new Date().getFullYear()}/${new Date().getMonth() + 1}`
                    })
                ]
            })
        ];
    }

    ngOnDestroy (): void {
        super.destroy();
    }

    get canManageUsers (): boolean {
        return this._authService.adminPermissions.canEditUserBasic ||
            this._authService.adminPermissions.canEditUserAdvanced ||
            this._authService.adminPermissions.canBanUser ||
            this._authService.adminPermissions.canRemoveEssentials ||
            this._authService.adminPermissions.canDoInfractions;
    }
}
