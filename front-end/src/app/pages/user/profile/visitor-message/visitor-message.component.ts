import { AfterContentInit, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ProfileVisitorMessage } from '../profile.model';
import { TimeHelper } from 'shared/helpers/time.helper';
import { ProfileService } from '../profile.service';
import { AuthService } from 'core/services/auth/auth.service';
import { NotificationService } from 'core/services/notification/notification.service';
import { InfractionService } from 'shared/components/infraction/infraction.service';
import { TitleTopBorder } from 'shared/app-views/title/title.model';

@Component({
    selector: 'app-user-profile-visitor-message',
    templateUrl: 'visitor-message.component.html',
    styleUrls: ['visitor-message.component.css']
})
export class VisitorMessageComponent implements AfterContentInit {
    private _visitorMessage: ProfileVisitorMessage;
    private _haveCheckedQueries = false;

    @Input() hostId: number;
    @Output() onRemove: EventEmitter<void> = new EventEmitter();
    @ViewChild('replies') repliesEle;
    isRepliesOpen = false;
    redHeader = TitleTopBorder.RED;

    content: string;

    constructor (
        private _profileService: ProfileService,
        private _authService: AuthService,
        private _notificationService: NotificationService,
        private _infractionService: InfractionService
    ) {
    }

    get isLoggedIn (): boolean {
        return this._authService.isLoggedIn();
    }

    get comments (): Array<ProfileVisitorMessage> {
        return this._visitorMessage.comments;
    }

    get replyCount (): number {
        return this._visitorMessage.replies;
    }

    @Input()
    set visitorMessage (visitorMessage: ProfileVisitorMessage) {
        this._visitorMessage = visitorMessage;
        this.ngAfterContentInit();
    }

    get visitorMessage (): ProfileVisitorMessage {
        return this._visitorMessage;
    }

    get canDeleteVisitorMessage (): boolean {
        return this._authService.adminPermissions.canModerateVisitorMessage;
    }

    delete (event, visitorMessage: ProfileVisitorMessage): void {
        event.stopPropagation();
        this._profileService.delete(visitorMessage).then(() => {
            if (visitorMessage.visitorMessageId === this._visitorMessage.visitorMessageId) {
                this.onRemove.emit();
            } else {
                this._visitorMessage.comments = this._visitorMessage.comments
                    .filter(item => item.visitorMessageId !== visitorMessage.visitorMessageId);
                this._visitorMessage.replies -= 1;
            }
        });
    }

    infract (event, visitorMessage: ProfileVisitorMessage): void {
        event.stopPropagation();
        this._infractionService.infract(visitorMessage.user.userId);
    }

    report (event, visitorMessage: ProfileVisitorMessage): void {
        event.stopPropagation();
        this._profileService.report(visitorMessage);
    }

    canReport (visitorMessage: ProfileVisitorMessage): boolean {
        return this._authService.isLoggedIn() && visitorMessage.user.userId !== this._authService.authUser.userId;
    }

    canInfract (visitorMessage: ProfileVisitorMessage): boolean {
        return this._authService.isLoggedIn() && visitorMessage.user.userId !== this._authService.authUser.userId &&
            this._authService.adminPermissions.canDoInfractions;
    }

    ngAfterContentInit (): void {
        if (this._haveCheckedQueries || !this._visitorMessage) {
            return;
        }
        this._haveCheckedQueries = true;
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('visitorMessageId') &&
            Number(urlParams.get('visitorMessageId')) === this.visitorMessage.visitorMessageId) {
            setTimeout(() => {
                this.isRepliesOpen = true;
                this.toggleReplies();
            }, 0);
        }
    }

    onToggleLike (event, visitorMessage: ProfileVisitorMessage): void {
        event.stopPropagation();
        if (visitorMessage.isLiking) {
            this._profileService.unlikeMessage(visitorMessage.visitorMessageId)
                .subscribe(() => {
                    visitorMessage.likes--;
                    visitorMessage.isLiking = false;
                    this._notificationService.sendInfoNotification('You un-liked the message!');
                }, this._notificationService.failureNotification.bind(this._notificationService));
        } else {
            this._profileService.likeMessage(visitorMessage.visitorMessageId)
                .subscribe(() => {
                    visitorMessage.likes++;
                    visitorMessage.isLiking = true;
                    this._notificationService.sendInfoNotification('You liked the message!');
                }, this._notificationService.failureNotification.bind(this._notificationService));
        }
    }

    onComment (): void {
        this._profileService.postVisitorMessage(this.hostId, this.content, this.visitorMessage.visitorMessageId)
            .subscribe(res => {
                this.visitorMessage.replies += 1;
                this.visitorMessage.comments.push(res);
                this._notificationService.sendInfoNotification('Comment posted');
                this.content = '';
            }, this._notificationService.failureNotification.bind(this._notificationService));
    }

    getTime (time: number): string {
        return TimeHelper.getTime(time);
    }

    toggleReplies (): void {
        if (this.isRepliesOpen) {
            // @ts-ignore
            $(this.repliesEle.nativeElement).slideDown('slow');
        } else {
            // @ts-ignore
            $(this.repliesEle.nativeElement).slideUp('slow');
        }
    }
}
