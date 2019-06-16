import { Component, Input } from '@angular/core';
import { UserHelper } from 'shared/helpers/user.helper';
import { MiniProfileModel } from './mini-profile.model';

@Component({
    selector: 'app-mini-profile',
    templateUrl: 'mini-profile.component.html',
    styleUrls: ['mini-profile.component.css']
})

export class MiniProfileComponent {
    @Input() data: MiniProfileModel;

    get miniProfilePosition (): string {
        return `left: ${this.data.left}px; top: ${this.data.top}px;`;
    }

    get avatarUrl (): string {
        return `background-image: url('/rest/resources/images/users/${this.data.user.userId}.gif')`;
    }

    get nameStyling (): string {
        return UserHelper.getNameColor(this.data.user.nameColor);
    }

    get coverUrl (): string {
        return `background-image: url('/rest/resources/images/covers/${this.data.user.userId}');`;
    }

    get posts (): string {
        return this.data.user.posts < 1000 ? `${this.data.user.posts}` : `${this.data.user.posts / 1000}K`;
    }

    get likes (): string {
        return this.data.user.likes < 1000 ? `${this.data.user.likes}` : `${this.data.user.likes / 1000}K`;
    }
}
