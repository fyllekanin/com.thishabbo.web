import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { BetActions, BetModel, BetPage } from '../bets.model';
import { ActivatedRoute, Router } from '@angular/router';
import { TitleTab } from 'shared/app-views/title/title.model';
import { HttpService } from 'core/services/http/http.service';
import { NotificationService } from 'core/services/notification/notification.service';
import { DialogService } from 'core/services/dialog/dialog.service';
import { NotificationMessage } from 'shared/app-views/global-notification/global-notification.model';

@Component({
    selector: 'app-betting-bet',
    templateUrl: 'bet.component.html',
    styleUrls: [ 'bet.component.css' ]
})
export class BetComponent extends Page implements OnDestroy {
    private _data: BetPage = new BetPage(null);

    tabs: Array<TitleTab> = [];

    constructor (
        private _httpService: HttpService,
        private _notificationService: NotificationService,
        private _dialogService: DialogService,
        private _router: Router,
        elementRef: ElementRef,
        activatedRoute: ActivatedRoute
    ) {
        super(elementRef);
        this.addSubscription(activatedRoute.data, this.onData.bind(this));
    }

    ngOnDestroy (): void {
        super.destroy();
    }

    onTabClick (value: number): void {
        switch (value) {
            case BetActions.SAVE:
            case BetActions.SAVE_AND_CREATE_NEW:
                this.onSave(BetActions.SAVE_AND_CREATE_NEW === value);
                break;
            case BetActions.BACK:
                this._router.navigateByUrl('/sitecp/betting/bets/page/1');
                break;
            case BetActions.DELETE:
                this.onDelete();
                break;
        }
    }

    get title (): string {
        const isCreated = this._data.bet && this._data.bet.createdAt;
        const name = this._data.bet && this._data.bet.name ? this._data.bet.name : '';
        return isCreated ?
            `Editing Bet: ${name}` :
            `Creating New Bet ${name}`;
    }

    get model (): BetPage {
        return this._data;
    }

    private onDelete (): void {
        this._dialogService.confirm({
            title: `Delete Bet`,
            content: `Are you sure you want to delete ${this._data.bet.name}?`,
            callback: this.doDelete.bind(this)
        });
    }

    private doDelete (): void {
        this._httpService.delete(`sitecp/betting/bet/${this._data.bet.betId}`)
            .subscribe(() => {
                this._notificationService.sendNotification(new NotificationMessage({
                    title: 'Success',
                    message: `${this._data.bet.name} is deleted!`
                }));
                this._router.navigateByUrl('/sitecp/betting/bets/page/1');
            }, error => {
                this._notificationService.failureNotification(error);
            }, () => {
                this._dialogService.closeDialog();
            });
    }

    private onSave (reload: boolean): void {
        const emptyBet = new BetPage({ categories: this._data.categories, bet: new BetModel({}) });
        if (this._data.bet.createdAt) {
            this._httpService.put(`sitecp/betting/bet/${this._data.bet.betId}`, { bet: this._data.bet })
                .subscribe(res => {
                    this._notificationService.sendNotification(new NotificationMessage({
                        title: 'Success',
                        message: `${this._data.bet.name} is updated!`
                    }));
                    this.onData({ data: reload ? emptyBet : new BetPage(res) });
                }, this._notificationService.failureNotification.bind(this._notificationService));
        } else {
            this._httpService.post('sitecp/betting/bet', { bet: this._data.bet })
                .subscribe(res => {
                    this._notificationService.sendNotification(new NotificationMessage({
                        title: 'Success',
                        message: `${this._data.bet.name} is created!`
                    }));
                    this.onData({ data: reload ? emptyBet : new BetPage(res) });
                }, this._notificationService.failureNotification.bind(this._notificationService));
        }
    }

    private onData (data: { data: BetPage }): void {
        this._data = data.data;

        const tabs = [
            { title: 'Save', value: BetActions.SAVE, condition: true },
            { title: 'Save & Create New', value: BetActions.SAVE_AND_CREATE_NEW, condition: true },
            { title: 'Back', value: BetActions.BACK, condition: true },
            { title: 'Delete', value: BetActions.DELETE, condition: this._data.bet.createdAt }
        ];
        this.tabs = tabs.filter(tab => tab.condition).map(tab => new TitleTab(tab));
    }
}
