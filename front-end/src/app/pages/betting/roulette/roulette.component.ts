import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { BETTING_HUB } from '../betting.constants';
import { Roulette, RouletteModel, RouletteNumber } from './roulette.model';
import { NumberHelper } from 'shared/helpers/number.helper';
import { HttpService } from 'core/services/http/http.service';
import { ActivatedRoute } from '@angular/router';
import { getBettingStats } from '../betting.model';
import { GlobalNotificationService } from 'core/services/notification/global-notification.service';
import { GlobalNotification, NotificationType } from 'shared/app-views/global-notification/global-notification.model';
import { TitleTopBorder } from 'shared/app-views/title/title.model';
import { StatsBoxModel } from 'shared/app-views/stats-boxes/stats-boxes.model';
import { AuthService } from 'core/services/auth/auth.service';


@Component({
    selector: 'app-betting-roulette',
    templateUrl: 'roulette.component.html',
    styleUrls: ['roulette.component.css']
})
export class RouletteComponent extends Page implements OnDestroy {
    private _data: RouletteModel = new RouletteModel();
    private _numbers: Array<RouletteNumber> = [];

    @ViewChild('wrapper') wrapper;
    @ViewChild('wheel') wheel;
    amount: number;
    betBorder = TitleTopBorder.BLUE;
    rouletteBorder = TitleTopBorder.RED;
    isSpinning = false;
    stats: Array<StatsBoxModel> = [];

    constructor(
        private _globalNotificationService: GlobalNotificationService,
        private _httpService: HttpService,
        private _authService: AuthService,
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
                BETTING_HUB
            ]
        });
    }

    ngOnDestroy(): void {
        super.destroy();
    }

    spin(color: string): void {
        if (this.isSpinning) {
            this._globalNotificationService.sendGlobalNotification(new GlobalNotification({
                title: 'Oops!',
                message: 'It\'s already spinning!',
                type: NotificationType.WARNING
            }));
            return;
        }
        this.isSpinning = true;
        this._httpService.post('betting/roulette', { color: color, amount: this.amount })
            .subscribe(res => {
                this.setMiddle(50);

                const item = new Roulette(res);
                this._numbers = item.numbers;
                this.setMiddle(item.boxNumber);

                setTimeout(() => {
                    let notification;
                    if (item.isWin) {
                        this._data.stats.credits += item.profit;
                        this._authService.authUser.credits += item.profit;
                        notification = new GlobalNotification({
                            title: 'Win!',
                            message: `You won ${item.profit} credits`,
                            type: NotificationType.SUCCESS
                        });
                    } else {
                        this._data.stats.credits -= this.amount;
                        this._authService.authUser.credits -= this.amount;
                        notification = new GlobalNotification({
                            title: 'Lost!',
                            message: `You lost ${this.amount} credits`,
                            type: NotificationType.ERROR
                        });
                    }
                    this.isSpinning = false;
                    this.updateStats();
                    this._globalNotificationService.sendGlobalNotification(notification);
                }, 2000);
            }, err => {
                this.isSpinning = false;
                this._globalNotificationService.failureNotification(err);
            });
    }

    get numbers(): Array<RouletteNumber> {
        return this._numbers;
    }

    private onData(data: { data: RouletteModel }): void {
        this._data = data.data;
        this.updateStats();
    }

    private updateStats(): void {
        this.stats = getBettingStats(this._data.stats);
    }

    private getInitial(): Array<RouletteNumber> {
        const numbers = [];
        for (let i = 0; i < 500; i++) {
            if (i % 10 === 0) {
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

    private setMiddle(number: number): void {
        const add = (this.wheel.nativeElement.offsetWidth / 2 - 25);
        this.wrapper.nativeElement.style.marginLeft = `-${number * 50 - add}px`;
    }
}
