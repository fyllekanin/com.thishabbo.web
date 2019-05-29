import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { DialogService } from 'core/services/dialog/dialog.service';
import { NotificationService } from 'core/services/notification/notification.service';
import { BBcodeActions, BBcodeModel } from '../bbcode.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { NotificationMessage } from 'shared/app-views/global-notification/global-notification.model';
import { TitleTab } from 'shared/app-views/title/title.model';
import { MANAGE_BBCODES_BREADCRUMB_ITEM, SITECP_BREADCRUMB_ITEM } from '../../../../admin.constants';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-admin-bbcodes-bbcode',
    templateUrl: 'bbcode.component.html'
})
export class BBcodeComponent extends Page implements OnDestroy {
    private _bbcode: BBcodeModel = new BBcodeModel();

    @ViewChild('image', { static: false }) imageInput;
    tabs: Array<TitleTab> = [];

    constructor (
        private _dialogService: DialogService,
        private _notificationService: NotificationService,
        private _httpClient: HttpClient,
        private _router: Router,
        activatedRoute: ActivatedRoute,
        elementRef: ElementRef,
        breadcrumbService: BreadcrumbService
    ) {
        super(elementRef);
        this.addSubscription(activatedRoute.data, this.onData.bind(this));
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: 'Editing BBCode',
            items: [
                SITECP_BREADCRUMB_ITEM,
                MANAGE_BBCODES_BREADCRUMB_ITEM
            ]
        });
    }

    ngOnDestroy (): void {
        super.destroy();
    }

    onTabClick (value: number): void {
        switch (value) {
            case BBcodeActions.CANCEL:
                this.cancel();
                break;
            case BBcodeActions.DELETE:
                this.delete();
                break;
            case BBcodeActions.SAVE:
                this.save();
                break;
        }
    }

    save (): void {
        const form = new FormData();
        if (this.imageInput && this.imageInput.nativeElement.files) {
            form.append('image', this.imageInput.nativeElement.files[0]);
        }
        form.append('bbcode', JSON.stringify(this._bbcode));

        if (this._bbcode.createdAt) {
            this._httpClient.post(`/rest/api/admin/content/bbcodes/${this._bbcode.bbcodeId}`, form)
                .subscribe((res: any) => {
                    this.onData({data: new BBcodeModel(res)});
                    this._notificationService.sendNotification(new NotificationMessage({
                        title: 'Success!',
                        message: 'BBCode has been saved!'
                    }));
                }, this._notificationService.failureNotification.bind(this._notificationService));
        } else {
            this._httpClient.post(`/rest/api/admin/content/bbcodes`, form)
                .subscribe((res: any) => {
                    this.onData({data: new BBcodeModel(res)});
                    this._notificationService.sendNotification(new NotificationMessage({
                        title: 'Success!',
                        message: 'BBcode has been created!'
                    }));
                }, this._notificationService.failureNotification.bind(this._notificationService));
        }
    }

    cancel (): void {
        this._router.navigateByUrl('/admin/content/bbcodes');
    }

    delete (): void {
        this._dialogService.confirm({
            title: `Delete BBcode`,
            content: `Are you sure that you want to delete the BBCode ${this._bbcode.name}?`,
            callback: this.onDelete.bind(this, this._bbcode)
        });
    }

    get title (): string {
        return this._bbcode.createdAt ?
            `Editing BBCode: ${this._bbcode.name}` :
            `Creating BBCode: ${this._bbcode.name}`;
    }

    get bbcode (): BBcodeModel {
        return this._bbcode;
    }

    get canDelete (): boolean {
        return Boolean(this._bbcode.createdAt);
    }

    private onDelete (bbcode: BBcodeModel): void {
        this._httpClient.delete(`/rest/api/admin/content/bbcodes/${bbcode.bbcodeId}`)
            .subscribe(() => {
                this._notificationService.sendNotification(new NotificationMessage({
                    title: 'Success',
                    message: 'BBcode deleted!'
                }));
                this._dialogService.closeDialog();
                this.cancel();
            }, this._notificationService.failureNotification.bind(this._notificationService));
    }

    private onData (data: { data: BBcodeModel }): void {
        this._bbcode = data.data;

        const tabs = [
            {title: 'Save', value: BBcodeActions.SAVE, condition: true},
            {title: 'Delete', value: BBcodeActions.DELETE, condition: this._bbcode.createdAt},
            {title: 'Cancel', value: BBcodeActions.CANCEL, condition: true}
        ];

        this.tabs = tabs.filter(tab => tab.condition).map(tab => new TitleTab(tab));
    }
}
