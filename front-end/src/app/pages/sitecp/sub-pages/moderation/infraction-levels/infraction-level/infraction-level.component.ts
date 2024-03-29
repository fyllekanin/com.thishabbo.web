import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { ActivatedRoute, Router } from '@angular/router';
import { InfractionLevel, InfractionLevelActions } from '../infraction-level.model';
import { TitleTab } from 'shared/app-views/title/title.model';
import { DialogService } from 'core/services/dialog/dialog.service';
import { HttpService } from 'core/services/http/http.service';
import { NotificationService } from 'core/services/notification/notification.service';
import { NotificationMessage } from 'shared/app-views/global-notification/global-notification.model';
import { SelectItem } from 'shared/components/form/select/select.model';
import { ArrayHelper } from 'shared/helpers/array.helper';

@Component({
    selector: 'app-sitecp-moderation-infraction-level',
    templateUrl: 'infraction-level.component.html'
})
export class InfractionLevelComponent extends Page implements OnDestroy {
    private _page = new InfractionLevel();

    tabs: Array<TitleTab>;
    selectedCategory: SelectItem = null;
    selectableCategories: Array<SelectItem> = [];

    constructor (
        private _dialogService: DialogService,
        private _httpService: HttpService,
        private _notificationService: NotificationService,
        private _router: Router,
        elementRef: ElementRef,
        activatedRoute: ActivatedRoute
    ) {
        super(elementRef);
        this.addSubscription(activatedRoute.data, this.onPage.bind(this));
    }

    ngOnDestroy (): void {
        super.destroy();
    }

    onTabClick (value: number): void {
        switch (value) {
            case InfractionLevelActions.SAVE:
                this.onSave();
                break;
            case InfractionLevelActions.DELETE:
                this.onDelete();
                break;
            case InfractionLevelActions.BACK:
                this._router.navigateByUrl('/sitecp/moderation/infraction-levels/page/1');
                break;
        }
    }

    onIsPersistedToggle (): void {
        if (this.isPersisted) {
            this._page.lifeTime = 0;
        } else {
            this._page.lifeTime = -1;
        }
    }

    get model (): InfractionLevel {
        return this._page;
    }

    get isPersisted (): boolean {
        return this._page.lifeTime < 0;
    }

    get title (): string {
        return this._page.createdAt ? `Updating: ${this._page.title}` : `Creating: ${this._page.title}`;
    }

    private onSave (): void {
        delete this._page.categories;
        this._page.categoryId = this.selectedCategory ? this.selectedCategory.value.categoryId : null;
        if (this._page.createdAt) {
            this._httpService.put(`sitecp/moderation/infraction-levels/${this._page.infractionLevelId}`,
                { infractionLevel: this._page })
                .subscribe(res => {
                    const data = new InfractionLevel(res);
                    this.onPage({ data: data });
                    this._notificationService.sendNotification(new NotificationMessage({
                        title: 'Success',
                        message: 'Infraction level updated'
                    }));
                }, this._notificationService.failureNotification.bind(this._notificationService));
        } else {
            this._httpService.post(`sitecp/moderation/infraction-levels`, { infractionLevel: this._page })
                .subscribe(res => {
                    const data = new InfractionLevel(res);
                    this.onPage({ data: data });
                    this._notificationService.sendNotification(new NotificationMessage({
                        title: 'Success',
                        message: 'Infraction level created'
                    }));
                }, this._notificationService.failureNotification.bind(this._notificationService));
        }
    }

    private onDelete (): void {
        this._dialogService.confirm({
            title: 'Delete Infraction Level',
            content: `Are you sure you want to delete this infraction level?`,
            callback: () => {
                this._httpService.delete(`sitecp/moderation/infraction-levels/${this._page.infractionLevelId}`)
                    .subscribe(() => {
                        this._notificationService.sendNotification(new NotificationMessage({
                            title: 'Success',
                            message: 'You have deleted this infraction level!'
                        }));
                        this._dialogService.closeDialog();
                        this._router.navigateByUrl('/sitecp/moderation/infraction-levels/page/1');
                    }, this._notificationService.failureNotification.bind(this._notificationService));
            }
        });
    }

    private onPage (data: { data: InfractionLevel }): void {
        this._page = data.data;

        const tabs = [
            { title: 'Save', value: InfractionLevelActions.SAVE, condition: true },
            { title: 'Delete', value: InfractionLevelActions.DELETE, condition: this._page.createdAt },
            { title: 'Back', value: InfractionLevelActions.BACK, condition: true }
        ];

        this.setSelectableItems();
        this.tabs = tabs.filter(tab => tab.condition)
            .map(tab => new TitleTab(tab));
    }

    private setSelectableItems (): void {
        this.selectableCategories = ArrayHelper.flat(this._page.categories, '').map(item => {
            return {
                label: item.title,
                value: item
            };
        });
        this.selectedCategory = this.selectableCategories
            .find(item => item.value.categoryId === this._page.categoryId);
    }
}
