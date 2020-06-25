import { Component } from '@angular/core';
import { InnerDialogComponent } from 'shared/app-views/dialog/dialog.model';

@Component({
    selector: 'app-forum-thread-change-owner',
    templateUrl: 'change-owner.component.html'
})
export class ChangeOwnerComponent extends InnerDialogComponent {
    nickname: string;

    getData (): string {
        return this.nickname;
    }

    setData (): void {
        // Empty
    }
}
