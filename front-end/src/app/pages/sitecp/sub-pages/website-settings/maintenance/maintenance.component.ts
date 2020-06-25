import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { HttpService } from 'core/services/http/http.service';
import { NotificationService } from 'core/services/notification/notification.service';
import { NotificationMessage } from 'shared/app-views/global-notification/global-notification.model';
import { EditorComponent } from 'shared/components/editor/editor.component';
import { EditorAction } from 'shared/components/editor/editor.model';
import { Page } from 'shared/page/page.model';
import { SITECP_BREADCRUMB_ITEM, WEBSITE_SETTINGS_BREADCRUMB_ITEM } from '../../../sitecp.constants';
import { MaintenanceActions, MaintenanceModel } from './maintenance.model';

@Component({
    selector: 'app-sitecp-maintenance',
    templateUrl: 'maintenance.component.html'
})
export class MaintenanceComponent extends Page implements OnDestroy {
    private _maintenanceModel: MaintenanceModel = new MaintenanceModel();

    @ViewChild('editor', { static: true }) editor: EditorComponent;
    buttons: Array<EditorAction> = [
        new EditorAction({ title: 'Save', value: MaintenanceActions.SAVE, saveCallback: this.onSave.bind(this) }),
        new EditorAction({ title: 'Back', value: MaintenanceActions.BACK })
    ];

    constructor (
        private _notificationService: NotificationService,
        private _httpService: HttpService,
        private _router: Router,
        activatedRoute: ActivatedRoute,
        elementRef: ElementRef,
        breadcrumbService: BreadcrumbService
    ) {
        super(elementRef);
        this.addSubscription(activatedRoute.data, this.onData.bind(this));
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: 'Manage Maintenance',
            items: [
                SITECP_BREADCRUMB_ITEM,
                WEBSITE_SETTINGS_BREADCRUMB_ITEM
            ]
        });
    }

    ngOnDestroy (): void {
        super.destroy();
    }

    onTabClick (event: EditorAction): void {
        switch (event.value) {
            case MaintenanceActions.SAVE:
                this.onSave();
                break;
            case MaintenanceActions.BACK:
                this._router.navigateByUrl('/sitecp/website-settings');
                break;
        }
    }

    get content (): string {
        return this._maintenanceModel.content;
    }

    private onData (data: { data: MaintenanceModel }): void {
        this._maintenanceModel = data.data;
    }

    private onSave (): void {
        this._maintenanceModel.content = this.editor.getEditorValue();
        this._httpService.put('sitecp/content/maintenance', { maintenance: this._maintenanceModel })
            .subscribe(() => {
                this._notificationService.sendNotification(new NotificationMessage({
                    title: 'Success',
                    message: this._maintenanceModel.content.length > 0 ? 'Maintenance turned on' : 'Maintenance turned off'
                }));
            }, this._notificationService.failureNotification.bind(this._notificationService));
    }
}
