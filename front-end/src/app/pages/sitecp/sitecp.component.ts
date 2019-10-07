import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from 'core/services/auth/auth.service';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { SideMenuBlock, SideMenuItem } from 'shared/app-views/side-menu/side-menu.model';
import { Page } from 'shared/page/page.model';

@Component({
    selector: 'app-sitecp',
    template: `
        <div class="grid-container">
            <div class="grid-x grid-margin-x">
                <div class="cell small-12 medium-9 position-relative">
                    <router-outlet></router-outlet>
                </div>
                <div class="cell small-12 medium-3">
                    <app-side-menu [blocks]="blocks"></app-side-menu>
                </div>
            </div>
        </div>`
})

export class SitecpComponent extends Page implements OnDestroy, OnInit {
    blocks: Array<SideMenuBlock> = [];

    constructor (
        private _authService: AuthService,
        breadcrumbService: BreadcrumbService,
        elementRef: ElementRef
    ) {
        super(elementRef);
        breadcrumbService.breadcrumb = new Breadcrumb({ current: 'SiteCP' });
    }

    ngOnInit (): void {
        this.blocks = [
            new SideMenuBlock({
                title: 'Content Management',
                items: [
                    new SideMenuItem({
                        title: 'Dashboard',
                        link: '/sitecp/dashboard'
                    }),
                    new SideMenuItem({
                        title: 'Manage BBCode',
                        link: '/sitecp/content/bbcodes',
                        isApplicable: this._authService.sitecpPermissions.canManageBBcodes
                    }),
                    new SideMenuItem({
                        title: 'Manage Staff List',
                        link: '/sitecp/content/groups-list',
                        isApplicable: this._authService.sitecpPermissions.canManageGroupsList
                    }),
                    new SideMenuItem({
                        title: 'Server Logs',
                        link: '/sitecp/server-logs',
                        isApplicable: this._authService.sitecpPermissions.canReadServerLogs
                    }),
                    new SideMenuItem({
                        title: 'Website Settings',
                        link: '/sitecp/website-settings',
                        isApplicable: this._authService.sitecpPermissions.canEditWebsiteSettings
                    })
                ]
            }),
            new SideMenuBlock({
                title: 'Shop',
                items: [
                    new SideMenuItem({
                        title: 'Manage Items',
                        link: '/sitecp/shop/items/page/1',
                        isApplicable: this._authService.sitecpPermissions.canManageShop
                    }),
                    new SideMenuItem({
                        title: 'Manage Subscriptions',
                        link: '/sitecp/shop/subscriptions/page/1',
                        isApplicable: this._authService.sitecpPermissions.canManageSubscriptions
                    }),
                    new SideMenuItem({
                        title: 'Manage Loot Boxes',
                        link: '/sitecp/shop/loot-boxes/page/1',
                        isApplicable: this._authService.sitecpPermissions.canManageShop
                    })
                ]
            }),
            new SideMenuBlock({
                title: 'Betting',
                items: [
                    new SideMenuItem({
                        title: 'Betting Categories',
                        link: '/sitecp/betting/categories/page/1',
                        isApplicable: this._authService.sitecpPermissions.canManageBetting
                    }),
                    new SideMenuItem({
                        title: 'Manage Bets',
                        link: '/sitecp/betting/bets/page/1',
                        isApplicable: this._authService.sitecpPermissions.canManageBetting
                    })
                ]
            }),
            new SideMenuBlock({
                title: 'Forum Management',
                items: [
                    new SideMenuItem({
                        title: 'Manage Categories',
                        link: '/sitecp/forum/categories/page/1',
                        isApplicable: this._authService.sitecpPermissions.canManageForum
                    }),
                    new SideMenuItem({
                        title: 'Manage Prefixes',
                        link: '/sitecp/forum/prefixes/page/1',
                        isApplicable: this._authService.sitecpPermissions.canManagePrefixes
                    })
                ]
            }),
            new SideMenuBlock({
                title: 'Moderation',
                items: [
                    new SideMenuItem({
                        title: 'Manage Automatic Bans',
                        link: '/sitecp/moderation/auto-bans/page/1',
                        isApplicable: this._authService.sitecpPermissions.canManageInfractions
                    }),
                    new SideMenuItem({
                        title: 'Manage Infraction Levels',
                        link: '/sitecp/moderation/infraction-levels/page/1',
                        isApplicable: this._authService.sitecpPermissions.canManageInfractions
                    }),
                    new SideMenuItem({
                        title: 'Manage Infractions',
                        link: '/sitecp/moderation/infractions/page/1',
                        isApplicable: this._authService.sitecpPermissions.canDoInfractions
                    }),
                    new SideMenuItem({
                        title: 'Manage Polls',
                        link: '/sitecp/moderation/polls/page/1',
                        isApplicable: this._authService.sitecpPermissions.canManagePolls
                    }),
                    new SideMenuItem({
                        title: 'Moderate Group Applications',
                        link: '/sitecp/moderation/groups',
                        isApplicable: this._authService.sitecpPermissions.canApprovePublicGroups
                    }),
                    new SideMenuItem({
                        title: 'Moderate Posts',
                        link: '/sitecp/moderation/posts',
                        isApplicable: this._authService.sitecpPermissions.canModeratePosts
                    }),
                    new SideMenuItem({
                        title: 'Moderate Threads',
                        link: '/sitecp/moderation/threads',
                        isApplicable: this._authService.sitecpPermissions.canModerateThreads
                    }),
                    new SideMenuItem({
                        title: 'View User Logs',
                        link: '/sitecp/moderation/logs/user/page/1',
                        isApplicable: this._authService.sitecpPermissions.canSeeLogs
                    })
                ]
            }),
            new SideMenuBlock({
                title: 'User Management',
                items: [
                    new SideMenuItem({
                        title: 'Manage Badges',
                        link: '/sitecp/badges/page/1',
                        isApplicable: this._authService.sitecpPermissions.canManageBadges
                    }),
                    new SideMenuItem({
                        title: 'Manage THC Requests',
                        link: '/sitecp/users/thc/requests',
                        isApplicable: this._authService.sitecpPermissions.canManageTHC
                    }),
                    new SideMenuItem({
                        title: 'Manage Usergroups',
                        link: '/sitecp/groups/page/1',
                        isApplicable: this._authService.sitecpPermissions.canManageGroups
                    }),
                    new SideMenuItem({
                        title: 'Manage Users',
                        link: '/sitecp/users/page/1',
                        isApplicable: this.canManageUsers
                    }),
                    new SideMenuItem({
                        title: 'Manage Voucher Codes',
                        link: '/sitecp/users/voucher-codes/page/1',
                        isApplicable: this._authService.sitecpPermissions.canManageTHC
                    }),
                    new SideMenuItem({
                        title: 'Search IP Address',
                        link: '/sitecp/users/ip-search',
                        isApplicable: this._authService.sitecpPermissions.canSeeIps
                    }),
                    new SideMenuItem({
                        title: 'View Banned Users',
                        link: '/sitecp/moderation/bans/page/1',
                        isApplicable: this._authService.sitecpPermissions.canBanUser
                    })
                ]
            }),
            new SideMenuBlock({
                title: 'Statistics',
                items: [
                    new SideMenuItem({
                        title: 'View Logged In',
                        link: `/sitecp/statistics/users/${new Date().getFullYear()}/${new Date().getMonth() + 1}`,
                        isApplicable: this._authService.sitecpPermissions.canViewStatistics
                    }),
                    new SideMenuItem({
                        title: 'View Posts',
                        link: `/sitecp/statistics/posts/${new Date().getFullYear()}/${new Date().getMonth() + 1}`,
                        isApplicable: this._authService.sitecpPermissions.canViewStatistics
                    }),
                    new SideMenuItem({
                        title: 'View Threads',
                        link: `/sitecp/statistics/threads/${new Date().getFullYear()}/${new Date().getMonth() + 1}`,
                        isApplicable: this._authService.sitecpPermissions.canViewStatistics
                    })
                ]
            })
        ];
    }

    ngOnDestroy (): void {
        super.destroy();
    }

    get canManageUsers (): boolean {
        return this._authService.sitecpPermissions.canEditUserBasic ||
            this._authService.sitecpPermissions.canEditUserAdvanced ||
            this._authService.sitecpPermissions.canBanUser ||
            this._authService.sitecpPermissions.canRemoveEssentials ||
            this._authService.sitecpPermissions.canDoInfractions ||
            this._authService.sitecpPermissions.canManageSubscriptions ||
            this._authService.sitecpPermissions.canEditUsersGroups;
    }
}
