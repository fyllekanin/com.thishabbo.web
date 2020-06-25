import { Component } from '@angular/core';
import { InnerDialogComponent } from 'shared/app-views/dialog/dialog.model';

@Component({
    selector: 'app-sitecp-users-merge-users',
    templateUrl: 'merge-users.component.html'
})
export class MergeUsersComponent extends InnerDialogComponent {
    nickname: string;
    otherNickname: string;
    swapUsers: boolean;

    getData () {
        return {
            otherNickname: this.otherNickname,
            swapUsers: this.swapUsers
        };
    }

    setData (nickname: string) {
        this.nickname = nickname;
    }
}
