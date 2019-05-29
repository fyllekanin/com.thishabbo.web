import { NotificationService } from 'core/services/notification/notification.service';
import { HttpService } from 'core/services/http/http.service';
import { ActivatedRoute } from '@angular/router';
import { ARCADE_BREADCRUM_ITEM } from '../arcade.constants';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { Page } from 'shared/page/page.model';
import { Coordinates, SnakeGameValues, SnakeSettings } from './snake.model';
import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { TitleTab } from 'shared/app-views/title/title.model';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { HighScoreModel } from '../arcade.model';
import { NotificationMessage } from 'shared/app-views/global-notification/global-notification.model';

@Component({
    selector: 'app-arcade-snake',
    templateUrl: 'snake.component.html'
})
export class SnakeComponent extends Page implements AfterViewInit, OnDestroy {
    private _gameId: number;
    private _highscore: Array<HighScoreModel> = [];
    private _onKeydownBackup;
    private _timerReference: NodeJS.Timer;
    private _canvas: HTMLCanvasElement;
    private _context: CanvasRenderingContext2D;
    private _gameValues: SnakeGameValues;
    private _defaultTabs: Array<TitleTab> = [
        new TitleTab({title: 'Start Game '})
    ];

    tabs: Array<TitleTab> = [];
    @ViewChild('game', { static: true }) gameArea: ElementRef;

    constructor (
        private _notificationService: NotificationService,
        private _httpService: HttpService,
        activatedRoute: ActivatedRoute,
        elementRef: ElementRef,
        breadcrumbService: BreadcrumbService
    ) {
        super(elementRef);
        this.tabs = this._defaultTabs;
        this.addSubscription(activatedRoute.data, this.onData.bind(this));
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: 'Snake',
            items: [ARCADE_BREADCRUM_ITEM]
        });
    }

    ngOnDestroy (): void {
        super.destroy();
        window.onkeydown = this._onKeydownBackup;
    }

    ngAfterViewInit (): void {
        this._canvas = this.gameArea.nativeElement;
        this._context = this._canvas.getContext('2d');
        this.runSetup();
        this.showLoseScreen();
    }

    start (): void {
        this._httpService.get('arcade/snake')
            .subscribe(res => {
                this._gameId = res.gameId;
                this.tabs = [];
                this._timerReference = setInterval(this.tick.bind(this), 100);
                this._gameValues = new SnakeGameValues();
                this._onKeydownBackup = window.onkeydown;
                window.onkeydown = e => {
                    if (!this._timerReference) {
                        return;
                    }
                    this._gameValues.newDirection = {
                        37: -1,
                        38: -2,
                        39: 1,
                        40: 2
                    }[e.keyCode] || this._gameValues.newDirection;
                    e.preventDefault();
                };
            });
    }

    get score (): number {
        return this._gameValues ? this._gameValues.score : 0;
    }

    get highscoreList (): Array<HighScoreModel> {
        return this._highscore;
    }

    private onData (data: { data: Array<HighScoreModel> }): void {
        this._highscore = data.data;
    }

    private tick (): void {
        let head: Coordinates = this._gameValues.newHead;
        this._gameValues.checkDirection();
        head = this._gameValues.updateHead(head);
        this._gameValues.checkCandy(head);

        this.updateGameArea(head);
    }

    private updateGameArea (head: Coordinates): void {
        this._context.fillStyle = '#ffffff';
        this._context.fillRect(0, 0, SnakeSettings.SIZE, SnakeSettings.SIZE);
        this._context.fillStyle = '#000000';

        this._gameValues.snake.unshift(head);
        this._gameValues.snake = this._gameValues.snake.slice(0, this._gameValues.length);

        this._gameValues.paintSnake(this._context);
        if (this.isGameLost(head)) {
            this.saveScore();
            window.onkeydown = this._onKeydownBackup;
            this.showLoseScreen();
            this.tabs = this._defaultTabs;
            clearInterval(this._timerReference);
            this._timerReference = null;
            return;
        }

        while (!this._gameValues.candy || this._gameValues.getSnakeObject()[SnakeSettings.stringifyCoord(this._gameValues.candy)]) {
            this._gameValues.candy = {x: SnakeSettings.randomOffset(), y: SnakeSettings.randomOffset()};
        }

        this._context.fillStyle = '#c37070';
        this._context.fillRect(this._gameValues.candy.x, this._gameValues.candy.y, SnakeSettings.GRID_SIZE, SnakeSettings.GRID_SIZE);
    }

    private saveScore (): void {
        this._httpService.post('arcade/snake', {result: {gameId: this._gameId, score: this._gameValues.score}})
            .subscribe(res => {
                this._highscore = res.highscore.map(item => new HighScoreModel(item));
                this._notificationService.sendNotification(new NotificationMessage({
                    title: 'Score',
                    message: `${res.score} candies`
                }));
            }, this._notificationService.failureNotification.bind(this._notificationService));
    }

    private isGameLost (head: Coordinates): boolean {
        return head.x < 0 ||
            head.x >= SnakeSettings.SIZE ||
            head.y < 0 ||
            head.y >= SnakeSettings.SIZE ||
            this._gameValues.getSnakeObject()[SnakeSettings.stringifyCoord(head)];
    }

    private showLoseScreen () {
        this._context.fillStyle = '#ffffff';
        this._context.fillRect(0, 0, SnakeSettings.SIZE, SnakeSettings.SIZE);

        this._context.fillStyle = '#000000';
        this._context.font = '10px serif';
        this._context.textAlign = 'center';
        this._context.fillText('Click "Start Game" to play!', SnakeSettings.SIZE / 2, SnakeSettings.SIZE / 2);
    }

    private runSetup (): void {
        SnakeSettings.setCanvasSettings(this._canvas);
        SnakeSettings.scaleContext(this._context);
    }
}
