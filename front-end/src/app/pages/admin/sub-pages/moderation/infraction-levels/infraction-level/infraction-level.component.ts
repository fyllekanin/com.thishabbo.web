import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { ActivatedRoute, Router } from '@angular/router';
import { InfractionLevel, InfractionLevelActions } from '../infraction-level.model';
import { TitleTab } from 'shared/app-views/title/title.model';
import { DialogService } from 'core/services/dialog/dialog.service';
import { HttpService } from 'core/services/http/http.service';
import { GlobalNotificationService } from 'core/services/notification/global-notification.service';
import { GlobalNotification } from 'shared/app-views/global-notification/global-notification.model';

@Component({
    selector: 'app-admin-moderation-infraction-level',
    templateUrl: 'infraction-level.component.html'
})
export class InfractionLevelComponent extends Page implements OnDestroy {
    private _page = new InfractionLevel();

    tabs: Array<TitleTab>;

    constructor(
        private _dialogService: DialogService,
        private _httpService: HttpService,
        private _globalNotificationService: GlobalNotificationService,
        private _router: Router,
        elementRef: ElementRef,
        activatedRoute: ActivatedRoute
    ) {
        super(elementRef);
        this.addSubscription(activatedRoute.data, this.onPage.bind(this));
    }

    ngOnDestroy(): void {
        super.destroy();
    }

    onTabClick(value: number): void {
        switch (value) {
            case InfractionLevelActions.SAVE:
                this.onSave();
                break;
            case InfractionLevelActions.DELETE:
                this.onDelete();
                break;
            case InfractionLevelActions.CANCEL:
                this._router.navigateByUrl('/admin/moderation/infraction-levels/page/1');
                break;
        }
    }

    onIsPersistedToggle(): void {
        if (this.isPersisted) {
            this._page.lifeTime = 0;
        } else {
            this._page.lifeTime = -1;
        }
    }

    get model(): InfractionLevel {
        return this._page;
    }

    get isPersisted(): boolean {
        return this._page.lifeTime < 0;
    }

    get title(): string {
        return this._page.createdAt ? `Updating: ${this._page.title}` : `Creating: ${this._page.title}`;
    }

    private onSave(): void {
        if (this._page.createdAt) {
            this._httpService.put(`admin/moderation/infraction-levels/${this._page.infractionLevelId}`,
                { infractionLevel: this._page })
                .subscribe(res => {
                    const data = new InfractionLevel(res);
                    this.onPage({ data: data });
                    this._globalNotificationService.sendGlobalNotification(new GlobalNotification({
                        title: 'Success',
                        message: 'Infraction level updated'
                    }));
                }, this._globalNotificationService.failureNotification.bind(this._globalNotificationService));
        } else {
            this._httpService.post(`admin/moderation/infraction-levels`, { infractionLevel: this._page })
                .subscribe(res => {
                    const data = new InfractionLevel(res);
                    this.onPage({ data: data });
                    this._globalNotificationService.sendGlobalNotification(new GlobalNotification({
                        title: 'Success',
                        message: 'Infraction level created'
                    }));
                }, this._globalNotificationService.failureNotification.bind(this._globalNotificationService));
        }
    }

    private onDelete(): void {
        this._dialogService.openConfirmDialog(
            'Are you sure?',
            `Are you sure you wanna delete this infraction level?`,
            () => {
                this._httpService.delete(`admin/moderation/infraction-levels/${this._page.infractionLevelId}`)
                    .subscribe(() => {
                        this._globalNotificationService.sendGlobalNotification(new GlobalNotification({
                            title: 'Success',
                            message: 'You deleted the infraction level'
                        }));
                        this._dialogService.closeDialog();
                        this._router.navigateByUrl('/admin/moderation/infraction-levels/page/1');
                    }, this._globalNotificationService.failureNotification.bind(this._globalNotificationService));
            }
        );
    }

    private onPage(data: { data: InfractionLevel }): void {
        this._page = data.data;

        const tabs = [
            { title: 'Cancel', value: InfractionLevelActions.CANCEL, condition: true },
            { title: 'Delete', value: InfractionLevelActions.DELETE, condition: this._page.createdAt },
            { title: 'Save', value: InfractionLevelActions.SAVE, condition: true }
        ];

        this.tabs = tabs.filter(tab => tab.condition)
            .map(tab => new TitleTab(tab));
    }
}
