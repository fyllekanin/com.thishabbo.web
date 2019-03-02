import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { Page } from 'shared/page/page.model';
import { USERCP_BREADCRUM_ITEM } from '../usercp.constants';
import { LOCAL_STORAGE } from 'shared/constants/local-storage.constants';

@Component({
    selector: 'app-user-usercp-dashboard',
    templateUrl: 'usercp-dashboard.component.html'
})
export class UsercpDashboardComponent extends Page implements OnDestroy {

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
