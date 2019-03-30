import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { Page } from 'shared/page/page.model';
import { USERCP_BREADCRUM_ITEM } from '../../usercp.constants';
import { LOCAL_STORAGE } from 'shared/constants/local-storage.constants';
import { StatsBoxModel } from 'shared/app-views/stats-boxes/stats-boxes.model';
import { TitleTopBorder } from 'shared/app-views/title/title.model';
import { TabModel } from 'shared/app-views/header/tabs/tabs.model';
import { ContinuesInformationService } from 'core/services/continues-information/continues-information.service';

@Component({
    selector: 'app-user-usercp-dashboard',
    templateUrl: 'dashboard.component.html'
})
export class DashboardComponent extends Page implements OnDestroy {
    private _tabs: Array<TabModel> = [];

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
        private _continuesInformation: ContinuesInformationService,
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
        try {
            this._tabs = JSON.parse(localStorage.getItem(LOCAL_STORAGE.TABS))
                .map(item => new TabModel(item));
        } catch (e) {
            this._tabs = [];
        }
    }

    onRemove(tab: TabModel): void {
        this._tabs = this._tabs.filter(item => item.label.toLowerCase() !== tab.label.toLowerCase());
        localStorage.setItem(LOCAL_STORAGE.TABS, JSON.stringify(this._tabs));
        this._continuesInformation.tabsUpdated();
    }

    ngOnDestroy (): void {
        super.destroy();
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

    set fixedMenu(value: boolean) {
        if (value) {
            localStorage.setItem(LOCAL_STORAGE.FIXED_MENU, 'true');
        } else {
            localStorage.removeItem(LOCAL_STORAGE.FIXED_MENU);
        }
    }

    get fixedMenu(): boolean {
        return Boolean(localStorage.getItem(LOCAL_STORAGE.FIXED_MENU));
    }

    get tabs(): Array<TabModel> {
        return this._tabs;
    }
}
