import { Component, Input, ViewChild } from '@angular/core';
import { ProfileVisitorMessage } from '../profile.model';
import { TimeHelper } from 'shared/helpers/time.helper';

@Component({
    selector: 'app-user-profile-visitor-message',
    templateUrl: 'visitor-message.component.html',
    styleUrls: ['visitor-message.component.css']
})
export class VisitorMessageComponent {

    @Input() visitorMessage: ProfileVisitorMessage;
    @ViewChild('replies') repliesEle;
    isRepliesOpen = false;

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
