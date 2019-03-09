import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { Page } from 'shared/page/page.model';
import { USERCP_BREADCRUM_ITEM } from '../usercp.constants';
import { LOCAL_STORAGE } from 'shared/constants/local-storage.constants';
import { StatsBoxModel } from 'shared/app-views/stats-boxes/stats-boxes.model';
import { TitleTopBorder } from 'shared/app-views/title/title.model';

@Component({
    selector: 'app-user-usercp-dashboard',
    templateUrl: 'usercp-dashboard.component.html'
})
export class UsercpDashboardComponent extends Page implements OnDestroy {

    stats: Array<StatsBoxModel> = [
        new StatsBoxModel({
            borderColor: TitleTopBorder.GREEN,
            icon: 'fas fa-coins',
            title: 'Template 1',
            breadText: 'Template 1'
        }),
        new StatsBoxModel({
            borderColor: TitleTopBorder.RED,
            icon: 'fas fa-gem',
            title: 'Template 2',
            breadText: 'Template 2'
        }),
        new StatsBoxModel({
            borderColor: TitleTopBorder.BLUE,
            icon: 'fas fa-thumbs-up',
            title: 'Template 3',
            breadText: 'Template 3'
        }),
        new StatsBoxModel({
            borderColor: TitleTopBorder.PINK,
            icon: 'fas fa-thumbs-down',
            title: 'Template 4',
            breadText: 'Template 4'
        })
    ];

    constructor (
        elementRef: ElementRef,
        breadcrumbService: BreadcrumbService
    ) {
        super(elementRef);
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: 'Dashboard',
            items: [
                USERCP_BREADCRUM_ITEM
            ]
        });
    }

    set editorSourceMode(value: boolean) {
        if (value) {
            localStorage.setItem(LOCAL_STORAGE.EDITOR_MODE, 'true');
        } else {
            localStorage.removeItem(LOCAL_STORAGE.EDITOR_MODE);
        }
    }

    get editorSourceMode(): boolean {
        return Boolean(localStorage.getItem(LOCAL_STORAGE.EDITOR_MODE));
    }

    set ignoreSignatures(value: boolean) {
        if (value) {
            localStorage.setItem(LOCAL_STORAGE.IGNORE_SIGNATURES, 'true');
        } else {
            localStorage.removeItem(LOCAL_STORAGE.IGNORE_SIGNATURES);
        }
    }

    get ignoreSignatures(): boolean {
        return Boolean(localStorage.getItem(LOCAL_STORAGE.IGNORE_SIGNATURES));
    }

    ngOnDestroy (): void {
        super.destroy();
    }
}
