import { Component, Input } from '@angular/core';
import { ThreadAnswer, ThreadPoll } from './thread-poll.model';
import { TitleTab } from 'shared/app-views/title/title.model';
import { HttpService } from 'core/services/http/http.service';
import { NotificationService } from 'core/services/notification/notification.service';
import { NotificationMessage } from 'shared/app-views/global-notification/global-notification.model';

@Component({
    selector: 'app-forum-thread-poll',
    templateUrl: 'thread-poll.component.html',
    styleUrls: ['thread-poll.component.css']
})
export class ThreadPollComponent {
    private _poll: ThreadPoll;
    private _threadId: number;

    answerId: string;
    tabs: Array<TitleTab> = [
        new TitleTab({ title: 'Vote' })
    ];

    constructor(
        private _httpService: HttpService,
        private _notificationService: NotificationService
    ) {}

    vote(): void {
        this._httpService.post(`forum/thread/${this._threadId}/vote`, { answerId: this.answerId })
            .subscribe(() => {
                this._notificationService.sendNotification(new NotificationMessage({
                    title: 'Success',
                    message: 'Your vote is saved!'
                }));
                this._poll.haveVoted = true;
                const answer = this._poll.answers.find(ans => ans.id === this.answerId);
                answer.answers += 1;
            }, this._notificationService.failureNotification.bind(this._notificationService));
    }

    @Input()
    set poll(poll: ThreadPoll) {
        this._poll = poll;
    }

    @Input()
    set threadId(threadId: number) {
        this._threadId = threadId;
    }

    get question(): string {
        return this._poll.question;
    }

    get haveVoted(): boolean {
        return this._poll.haveVoted;
    }

    get options(): Array<ThreadAnswer> {
        return this._poll.answers;
    }

    get answers(): Array<{ label: string, percentage: number, votes: number }> {
        const total = this._poll.answers.reduce((prev, curr) => {
            return prev + curr.answers;
        }, 0);
        return this._poll.answers.map(answer => {
            return {
                label: answer.label,
                percentage: answer.answers / total * 100,
                votes: answer.answers
            };
        });
    }
}
