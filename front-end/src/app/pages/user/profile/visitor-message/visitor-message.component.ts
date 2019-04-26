import { Component, Input, ViewChild } from '@angular/core';
import { ProfileVisitorMessage } from '../profile.model';
import { TimeHelper } from 'shared/helpers/time.helper';
import { ProfileService } from '../profile.service';
import { AuthService } from 'core/services/auth/auth.service';
import { NotificationService } from 'core/services/notification/notification.service';

@Component({
    selector: 'app-user-profile-visitor-message',
    templateUrl: 'visitor-message.component.html',
    styleUrls: ['visitor-message.component.css']
})
export class VisitorMessageComponent {

    @Input() visitorMessage: ProfileVisitorMessage;
    @Input() hostId: number;
    @ViewChild('replies') repliesEle;
    isRepliesOpen = false;

    content: string;

    constructor (
        private _profileService: ProfileService,
        private _authService: AuthService,
        private _notificationService: NotificationService
    ) {
    }

    get isLoggedIn (): boolean {
        return this._authService.isLoggedIn();
    }

    get comments (): Array<ProfileVisitorMessage> {
        return this.visitorMessage.comments;
    }

    get replyCount (): number {
        return this.visitorMessage.replies;
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
