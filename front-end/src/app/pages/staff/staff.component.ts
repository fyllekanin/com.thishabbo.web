import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { Page } from 'shared/page/page.model';
import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { SideMenuBlock, SideMenuItem } from 'shared/app-views/side-menu/side-menu.model';
import { AuthService } from 'core/services/auth/auth.service';

@Component({
    selector: 'app-staff',
    template: `
    <div class="grid-container">
        <div class="grid-x margin-x">
            <div class="cell small-12 medium-8 position-relative">
                <router-outlet></router-outlet>
            </div>
            <div class="cell small-12 medium-4">
                <app-side-menu [blocks]="blocks"></app-side-menu>
            </div>
        </div>
    </div>`
})

export class StaffComponent extends Page implements OnDestroy, OnInit {

    blocks: Array<SideMenuBlock> = [];

    constructor(
        private _authService: AuthService,
        breadcrumbService: BreadcrumbService,
        elementRef: ElementRef
    ) {
        super(elementRef);
        breadcrumbService.breadcrumb = new Breadcrumb({ current: 'StaffCP' });
    }

    ngOnInit(): void {
        this.blocks = [
            new SideMenuBlock({
                title: 'All Staff',
                items: [
                    new SideMenuItem({ title: 'Dashboard', link: '/staff/dashboard' }),
                    new SideMenuItem({ title: 'Request THC', link: '/staff/request-thc' })
                ]
            }),
            new SideMenuBlock({
                title: 'Radio',
                items: [
                    new SideMenuItem({
                        title: 'Radio Timetable',
                        link: '/staff/radio/timetable',
                        isApplicable: this._authService.staffPermissions.canRadio
                    }),
                    new SideMenuItem({
                        title: 'DJ Says',
                        link: '/staff/radio/dj-says',
                        isApplicable: this._authService.staffPermissions.canRadio
                    }),
                    new SideMenuItem({
                        title: 'Connection Information',
                        link: '/staff/radio/connection',
                        isApplicable: this._authService.staffPermissions.canRadio
                    }),
                    new SideMenuItem({
                        title: 'Requests',
                        link: '/staff/radio/requests',
                        isApplicable: this._authService.staffPermissions.canRadio
                    }),
                    new SideMenuItem({
                        title: 'Manage Permanent Shows',
                        link: '/staff/radio/permanent-shows/page/1',
                        isApplicable: this._authService.staffPermissions.canManagePermShows
                    }),
                    new SideMenuItem({
                        title: 'Booking Logs',
                        link: '/staff/radio/booking/page/1',
                        isApplicable: this._authService.staffPermissions.canSeeBookingLogs
                    })
                ]
            }),
            new SideMenuBlock({
                title: 'Event',
                items: [
                    new SideMenuItem({
                        title: 'Events Timetable',
                        link: '/staff/events/timetable',
                        isApplicable: this._authService.staffPermissions.canEvent
                    }),
                    new SideMenuItem({
                        title: 'Manage Event Types',
                        link: '/staff/events/types/page/1',
                        isApplicable: this._authService.staffPermissions.canManageEvents
                    }),
                    new SideMenuItem({
                        title: 'Booking Logs',
                        link: '/staff/events/booking/page/1',
                        isApplicable: this._authService.staffPermissions.canSeeBookingLogs
                    }),
                    new SideMenuItem({
                        title: 'BOS List',
                        link: '/staff/events/ban-on-sight',
                        isApplicable: this._authService.staffPermissions.canEvent
                    })
                ]
            }),
            new SideMenuBlock({
                title: 'Management',
                items: [
                    new SideMenuItem({
                        title: 'Do Not Hire List',
                        link: '/staff/management/do-not-hire',
                        isApplicable: this._authService.staffPermissions.canSeeDoNotHire
                    }),
                    new SideMenuItem({
                        title: 'Current listeners',
                        link: '/staff/management/current-listeners',
                        isApplicable: this._authService.staffPermissions.canSeeListeners
                    }),
                    new SideMenuItem({
                        title: 'Manage Connection Information',
                        link: '/staff/radio/manage-connection',
                        isApplicable: this._authService.staffPermissions.canEditRadioInfo
                    }),
                    new SideMenuItem({
                        title: 'Kick DJ',
                        link: '/staff/radio/kick-dj',
                        isApplicable: this._authService.staffPermissions.canKickDjOffAir
                    }),
                ]
            })
        ];
    }

    ngOnDestroy(): void {
        super.destroy();
    }
}
