import { Component, Input } from '@angular/core';
import { StaffSpotlightUser } from '../home-default.model';

@Component({
    selector: 'app-home-staff-spotlight',
    templateUrl: 'staff-spotlight.component.html',
    styleUrls: ['staff-spotlight.component.css']
})
export class StaffSpotlightComponent {
    private _users: Array<StaffSpotlightUser> = [];
    private _current: StaffSpotlightUser = null;
    private _index = 0;

    imageClass: string;

    next(): void {
        this._index = Boolean(this._users[this._index + 1]) ? this._index + 1 : 0;
        this.imageClass = 'right';
        setTimeout(() => {
            this._current = this._users[this._index];
            this.imageClass = '';
        }, 750);
    }

    previous(): void {
        this._index = Boolean(this._users[this._index - 1]) ? this._index - 1 : this._users.length - 1;
        this.imageClass = 'left';
        setTimeout(() => {
            this._current = this._users[this._index];
            this.imageClass = '';
        }, 750);
    }

    @Input()
    set users(users: Array<StaffSpotlightUser>) {
        this._users = users;
        this._current = this._users[this._index];
    }

    get nickname(): string {
        return this._current ? this._current.nickname : '';
    }

    get role(): string {
        return this._current ? this._current.role : '';
    }

    get habbo(): string {
        const base = 'https://www.habbo.com/habbo-imaging/avatarimage?user=';
        const modifiers = '&direction=4&head_direction=3&action=0&gesture=sml&size=m';
        return this._current ? `${base}${this._current.habbo}${modifiers}` : '';
    }
}
