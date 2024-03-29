import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { Roulette, RouletteModel, RouletteNumber } from './roulette.model';
import { NumberHelper } from 'shared/helpers/number.helper';
import { HttpService } from 'core/services/http/http.service';
import { ActivatedRoute } from '@angular/router';
import { getBettingStats } from '../betting.model';
import { NotificationService } from 'core/services/notification/notification.service';
import { NotificationMessage, NotificationType } from 'shared/app-views/global-notification/global-notification.model';
import { TitleTopBorder } from 'shared/app-views/title/title.model';
import { StatsBoxModel } from 'shared/app-views/stats-boxes/stats-boxes.model';
import { ARCADE_BREADCRUM_ITEM } from '../../arcade/arcade.constants';


@Component({
    selector: 'app-betting-roulette',
    templateUrl: 'roulette.component.html',
    styleUrls: [ 'roulette.component.css' ]
})
export class RouletteComponent extends Page implements OnDestroy {
    private _data: RouletteModel = new RouletteModel();
    private _numbers: Array<RouletteNumber> = [];

    @ViewChild('wrapper', { static: true }) wrapper;
    @ViewChild('wheel', { static: true }) wheel;
    amount: number;
    betBorder = TitleTopBorder.BLUE;
    rouletteBorder = TitleTopBorder.RED;
    isSpinning = false;
    stats: Array<StatsBoxModel> = [];

    constructor (
        private _notificationService: NotificationService,
        private _httpService: HttpService,
        elementRef: ElementRef,
        breadcrumbService: BreadcrumbService,
        activatedRoute: ActivatedRoute
    ) {
        super(elementRef);
        this.addSubscription(activatedRoute.data, this.onData.bind(this));
        this._numbers = this.getInitial();
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: 'Roulette',
            items: [
                ARCADE_BREADCRUM_ITEM
            ]
        });
    }

    ngOnDestroy (): void {
        super.destroy();
    }

    spin (color: string): void {
        if (this.isSpinning) {
            this._notificationService.sendNotification(new NotificationMessage({
                title: 'Oops!',
                message: 'It\'s already spinning!',
                type: NotificationType.WARNING
            }));
            return;
        }
        this.isSpinning = true;
        this._httpService.post('betting/roulette', { color: color, amount: this.amount })
            .subscribe(res => {
                const item = new Roulette(res);
                this._numbers = item.numbers;

                setTimeout(() => {
                    this.setMiddle(item.boxNumber);
                    let notification;
                    setTimeout(() => {
                        if (item.isWin) {
                            this._data.stats.credits += item.profit;
                            notification = new NotificationMessage({
                                title: 'Win!',
                                message: `You won ${item.profit} credits`,
                                type: NotificationType.SUCCESS
                            });
                        } else {
                            this._data.stats.credits -= this.amount;
                            notification = new NotificationMessage({
                                title: 'Lost!',
                                message: `You lost ${this.amount} credits`,
                                type: NotificationType.ERROR
                            });
                        }
                        this.isSpinning = false;
                        this.updateStats();
                        this._notificationService.sendNotification(notification);
                    }, 1500);
                }, 200);
            }, err => {
                this.isSpinning = false;
                this._notificationService.failureNotification(err);
            });
    }

    get numbers (): Array<RouletteNumber> {
        return this._numbers;
    }

    private onData (data: { data: RouletteModel }): void {
        this._data = data.data;
        this.updateStats();
    }

    private updateStats (): void {
        this.stats = getBettingStats(this._data.stats);
    }

    private getInitial (): Array<RouletteNumber> {
        const numbers = [];
        for (let i = 0; i < 400; i++) {
            if (i % 6 === 0) {
                numbers.push(new RouletteNumber({
                    number: 0,
                    color: 'green'
                }));
            }
            const number = NumberHelper.random(1, 14);
            const rouletteNumber = new RouletteNumber({
                number: number,
                color: i % 2 === 0 ? 'black' : 'red'
            });
            numbers.push(rouletteNumber);
        }
        return numbers;
    }

    private setMiddle (number: number): void {
        const add = (this.wheel.nativeElement.offsetWidth / 2 - 25);
        this.wrapper.nativeElement.style.marginLeft = `-${number * 50 - add}px`;
    }
}
