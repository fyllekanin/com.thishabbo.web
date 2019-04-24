import { Component, ViewChild } from '@angular/core';

@Component({
    selector: 'app-user-profile-visitor-message',
    templateUrl: 'visitor-message.component.html',
    styleUrls: ['visitor-message.component.css']
})
export class VisitorMessageComponent {

    @ViewChild('replies') repliesEle;
    isRepliesOpen = false;

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
