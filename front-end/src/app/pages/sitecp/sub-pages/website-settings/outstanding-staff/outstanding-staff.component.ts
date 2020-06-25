import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { Member, OutstandingStaffActions, OutstandingStaffModel } from './outstanding-staff.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Page } from 'shared/page/page.model';
import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { TitleTab } from 'shared/app-views/title/title.model';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { SITECP_BREADCRUMB_ITEM, WEBSITE_SETTINGS_BREADCRUMB_ITEM } from '../../../sitecp.constants';
import { NotificationService } from 'core/services/notification/notification.service';
import { HttpService } from 'core/services/http/http.service';
import { NotificationMessage } from 'shared/app-views/global-notification/global-notification.model';
import { TimeHelper } from 'shared/helpers/time.helper';
import { SelectItem } from 'shared/components/form/select/select.model';
import { ArrayHelper } from 'shared/helpers/array.helper';
import { DialogService } from 'core/services/dialog/dialog.service';
import { EditorComponent } from 'shared/components/editor/editor.component';

@Component({
    selector: 'app-sitecp-content-outstanding-staff',
    templateUrl: 'outstanding-staff.component.html',
    styleUrls: [ 'outstanding-staff.component.css' ]
})
export class OutstandingStaffComponent extends Page implements OnDestroy {
    private _data = new OutstandingStaffModel();

    @ViewChild(EditorComponent, { static: true }) editorComponent: EditorComponent;

    categories: Array<SelectItem> = [];
    subscriptions: Array<SelectItem> = [];
    selectedCategoryItem: SelectItem;
    selectedSubscriptionItem: SelectItem;
    bottomTabs: Array<TitleTab> = [
        new TitleTab({ title: 'New Row', value: null })
    ];
    topTabs: Array<TitleTab> = [
        new TitleTab({ title: 'Save', value: OutstandingStaffActions.SAVE }),
        new TitleTab({ title: 'Back', value: OutstandingStaffActions.BACK })
    ];

    constructor (
        private _notificationService: NotificationService,
        private _httpService: HttpService,
        private _router: Router,
        private _dialogService: DialogService,
        activatedRoute: ActivatedRoute,
        elementRef: ElementRef,
        breadcrumbService: BreadcrumbService
    ) {
        super(elementRef);
        this.addSubscription(activatedRoute.data, this.onData.bind(this));
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: 'Outstanding Staff',
            items: [
                SITECP_BREADCRUMB_ITEM,
                WEBSITE_SETTINGS_BREADCRUMB_ITEM
            ]
        });
    }

    ngOnDestroy (): void {
        super.destroy();
    }

    addNewRow (): void {
        this._data.members.push(new Member());
    }

    onCategoryChange (item: SelectItem): void {
        this._data.categoryId = item ? item.value : null;
        this.selectedCategoryItem = item;
    }

    onRemove (member: Member): void {
        this._data.members = this._data.members.filter(item => item !== member);
    }

    onSubscriptionChange (item: SelectItem): void {
        this._data.subscriptionId = item ? item.value : null;
        this.selectedSubscriptionItem = item;
    }

    get model (): OutstandingStaffModel {
        return this._data;
    }

    get months (): Array<string> {
        return TimeHelper.FULL_MONTHS;
    }

    onTabClick (action: number): void {
        switch (action) {
            case OutstandingStaffActions.SAVE:
                this._dialogService.confirm({
                    title: 'Are you sure?',
                    content: 'Are you sure you wanna save this?',
                    callback: () => {
                        this._data.content = this.editorComponent.getEditorValue();
                        this._httpService.put('sitecp/content/outstanding-staff', { information: this._data })
                            .subscribe(() => {
                                this.onSuccessUpdate();
                            }, error => {
                                this._notificationService.failureNotification(error);
                            });
                        this._dialogService.closeDialog();
                    }
                });
                break;
            case OutstandingStaffActions.BACK:
                this._router.navigateByUrl('/sitecp/website-settings');
                break;
        }
    }

    private onSuccessUpdate (): void {
        this._notificationService.sendNotification(new NotificationMessage({
            title: 'Success',
            message: 'Outstanding Staff updated!'
        }));
    }

    private onData (data: { data: OutstandingStaffModel }): void {
        this._data = data.data;
        this.categories = ArrayHelper.flatCategories(this._data.categories, '', true)
            .map(item => ({ label: item.title, value: item.categoryId }));
        this.subscriptions = this._data.subscriptions.map(item => ({ label: item.title, value: item.subscriptionId }));
        this.selectedSubscriptionItem = this.subscriptions.find(item => item.value === this._data.subscriptionId);
        this.selectedCategoryItem = this.categories.find(item => item.value === this._data.categoryId);
    }
}
