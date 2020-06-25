import { ActivatedRoute } from '@angular/router';
import { NotificationService } from 'core/services/notification/notification.service';
import { FastTyperModel } from './fast-typer.model';
import { HttpService } from 'core/services/http/http.service';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { Page } from 'shared/page/page.model';
import { Component, ElementRef, OnDestroy, Renderer2, ViewEncapsulation } from '@angular/core';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { ARCADE_BREADCRUM_ITEM } from '../arcade.constants';
import { TitleTab } from 'shared/app-views/title/title.model';
import { NotificationMessage } from 'shared/app-views/global-notification/global-notification.model';
import { HighScoreModel } from '../arcade.model';

@Component({
    selector: 'app-arcade-fast-typer',
    templateUrl: 'fast-typer.component.html',
    styleUrls: [ 'fast-typer.component.css' ],
    encapsulation: ViewEncapsulation.None
})
export class FastTyperComponent extends Page implements OnDestroy {
    private _highscore: Array<HighScoreModel> = [];
    private _fastTyperModel: FastTyperModel = new FastTyperModel();
    private _awaitingStart = '<em>Awaiting user to start game...</em>';
    private _defaultTabs: Array<TitleTab> = [
        new TitleTab({ title: 'Start Game' })
    ];

    gameInput = '';
    timer = 3;
    tabs: Array<TitleTab> = [];

    constructor (
        private _notificationService: NotificationService,
        private _renderer: Renderer2,
        private _httpService: HttpService,
        activatedRoute: ActivatedRoute,
        elementRef: ElementRef,
        breadcrumbService: BreadcrumbService
    ) {
        super(elementRef);
        this.addSubscription(activatedRoute.data, this.onData.bind(this));
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: 'Fast Typer',
            items: [
                ARCADE_BREADCRUM_ITEM
            ]
        });
        this.tabs = this._defaultTabs;
    }

    ngOnDestroy (): void {
        super.destroy();
    }

    startGame (): void {
        this.tabs = [];
        this._httpService.get('arcade/fast-typer').subscribe(res => {
            this._fastTyperModel = new FastTyperModel(res);

            this.timer = 3;
            this.startCountDown();
        });
    }

    checkContent (): void {
        if (!this.wordMatching(this._fastTyperModel.isLastWord())) {
            return;
        }

        this.gameInput = '';
        if (this._fastTyperModel.isLastWord()) {
            this.tabs = this._defaultTabs;
            this._fastTyperModel.stopGame();
            this._httpService.post('arcade/fast-typer', { result: this._fastTyperModel })
                .subscribe((res: { score: number, highscore: Array<HighScoreModel> }) => {
                    this._highscore = res.highscore.map(item => new HighScoreModel(item));
                    this._notificationService.sendNotification(new NotificationMessage({
                        title: 'Score',
                        message: `Words per minute: ${res.score}`
                    }));
                }, this._notificationService.failureNotification.bind(this._notificationService));
        } else {
            this._fastTyperModel.nextWord();
        }
    }

    get highscoreList (): Array<HighScoreModel> {
        return this._highscore;
    }

    get countDownGoing (): boolean {
        return this._fastTyperModel.isCountDown;
    }

    get isGameRunning (): boolean {
        return this._fastTyperModel.isGameRunning;
    }

    get gameContent (): string {
        return this.isGameRunning ? this._fastTyperModel.words.map((word, index) => {
            return index <= this._fastTyperModel.currentWord.index ? `<span class="cleared">${word}</span>` : word;
        }).join(' ') : this._awaitingStart;
    }

    private onData (data: { data: Array<HighScoreModel> }): void {
        this._highscore = data.data;
    }

    private wordMatching (isLastWord: boolean): boolean {
        return this.gameInput === (this._fastTyperModel.currentWord.word + (isLastWord ? '' : ' '));
    }

    private startCountDown (): void {
        this._fastTyperModel.startCountDown();
        const countDownTimer = setInterval(() => {
            if (this.timer-- && this.timer > 0) {
                return;
            }
            this.focusInput();
            this._fastTyperModel.startGame();
            this._fastTyperModel.stopCountDown();
            clearInterval(countDownTimer);
        }, 1000);
    }

    private focusInput (): void {
        const element = this._renderer.selectRootElement('#gameInput');
        setTimeout(() => element.focus(), 0);
    }
}
