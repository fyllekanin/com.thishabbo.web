import { Component } from '@angular/core';
import { InnerDialogComponent } from 'shared/app-views/dialog/dialog.model';
import { EventType } from '../../../events/types/types.model';
import { TimetableModel } from '../timetable.model';

@Component({
    selector: 'app-staff-radio-timetable-selection',
    templateUrl: 'selection.component.html',
    styleUrls: ['selection.component.css']
})
export class SelectionComponent extends InnerDialogComponent {
    private _data: {
        events: Array<EventType>,
        canBookRadioForOther: boolean,
        canBookEventForOther: boolean,
        isEvents: boolean,
        slot: TimetableModel
    } = null;

    nickname: string;
    eventId: number;
    link: string;

    getData () {
        return {
            nickname: this.nickname,
            eventId: this.eventId,
            link: this.link
        };
    }

    setData (data) {
        this._data = data;
        if (this._data.slot) {
            this.nickname = this._data.slot.user.nickname;
            this.eventId = this._data.isEvents ? this._data.slot.event.eventId : null;
            this.link = this._data.isEvents ? this._data.slot.link : null;
        }
    }

    get canBookForOther (): boolean {
        return this._data.isEvents ? this._data.canBookEventForOther : this._data.canBookRadioForOther;
    }

    get canSelectEvent (): boolean {
        return this._data.isEvents;
    }

    get events (): Array<EventType> {
        return this._data.events;
    }
}
