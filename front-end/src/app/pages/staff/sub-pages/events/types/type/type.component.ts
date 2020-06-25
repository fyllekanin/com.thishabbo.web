import { Component } from '@angular/core';
import { InnerDialogComponent } from 'shared/app-views/dialog/dialog.model';
import { EventType } from '../types.model';

@Component({
    selector: 'app-staff-events-type',
    templateUrl: 'type.component.html'
})
export class TypeComponent extends InnerDialogComponent {
    private _event: EventType;

    setData (event: EventType): void {
        this._event = event;
    }

    getData (): EventType {
        return this._event;
    }

    get event (): string {
        return this._event.name;
    }

    set event (name: string) {
        this._event.name = name;
    }
}
