import { Component, Input, OnInit } from '@angular/core';
import { ThreadAnswer, ThreadPoll } from './thread-poll.model';
import { TitleTab } from 'shared/app-views/title/title.model';
import { HttpService } from 'core/services/http/http.service';
import { NotificationService } from 'core/services/notification/notification.service';
import { NotificationMessage } from 'shared/app-views/global-notification/global-notification.model';
import { AuthService } from 'core/services/auth/auth.service';

@Component({
    selector: 'app-forum-thread-poll',
    templateUrl: 'thread-poll.component.html',
    styleUrls: ['thread-poll.component.css']
})
export class ThreadPollComponent implements OnInit {
    private _poll: ThreadPoll;
    private _threadId: number;

    answerId: string;
    tabs: Array<TitleTab> = [];
    answers: Array<{ label: string, percentage: number, votes: number }> = [];

    constructor (
        private _httpService: HttpService,
        private _notificationService: NotificationService,
        private _authService: AuthService
    ) {
    }

    ngOnInit (): void {
        if (!this._authService.isLoggedIn()) {
            this.tabs = [];
            return;
        }
        this.tabs = [
            new TitleTab({title: 'Vote'})
        ];
    }

    vote (): void {
        this._httpService.post(`forum/thread/${this._threadId}/vote`, {answerId: this.answerId})
            .subscribe(poll => {
                this._poll = new ThreadPoll(poll);
                this.setAnswers();
                this._notificationService.sendNotification(new NotificationMessage({
                    title: 'Success',
                    message: 'Your vote is saved!'
                }));
            }, this._notificationService.failureNotification.bind(this._notificationService));
    }

    @Input()
    set poll (poll: ThreadPoll) {
        this._poll = poll;
        this.setAnswers();
    }

    @Input()
    set threadId (threadId: number) {
        this._threadId = threadId;
    }

    get question (): string {
        return this._poll.question;
    }

    get haveVoted (): boolean {
        return this._poll.haveVoted;
    }

    get isPublic (): boolean {
        return this._poll.isPublic;
    }

    get options (): Array<ThreadAnswer> {
        return this._poll.answers;
    }

    private setAnswers (): void {
        const total = this._poll.answers.reduce((prev, curr) => {
            return prev + curr.answers;
        }, 0);
        this.answers = this._poll.answers.map(answer => {
            return {
                label: answer.label,
                percentage: answer.answers / total * 100,
                votes: answer.answers
            };
        });
    }
}
