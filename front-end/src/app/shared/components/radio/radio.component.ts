import { Component, Input } from '@angular/core';
import { EventsModel, RadioModel } from 'shared/components/radio/radio.model';
import { RadioService } from './services/radio.service';

@Component({
    selector: 'app-radio',
    templateUrl: 'radio.component.html',
    styleUrls: ['radio.component.css']
})
export class RadioComponent {
    private _stats: RadioModel;
    private _eventStats: EventsModel;
    private readonly loading = 'Loading...';

    constructor (
        private _radioService: RadioService
    ) {
    }

    @Input()
    set stats (stats: RadioModel) {
        this._stats = stats;
    }

    @Input()
    set eventStats (stats: EventsModel) {
        this._eventStats = stats;
    }

    openRequest (): void {
        this._radioService.openRequest();
    }

    likeDj (): void {
        this._radioService.likeDj();
    }

    likeHost (): void {
        this._radioService.likeHost();
    }

    visitEvent (): void {
        window.open(this._eventStats.link, '_blank');
        window.focus();
    }

    get currentHost (): string {
        return this._eventStats && this._eventStats.nickname ? this._eventStats.nickname : 'Not Booked';
    }

    get currentEvent (): string {
        return this._eventStats && this._eventStats.event ? this._eventStats.event : '';
    }

    get nextHost (): string {
        return this._eventStats && this._eventStats.nextHost ? this._eventStats.nextHost : 'Not Booked';
    }

    get nextEvent (): string {
        return this._eventStats && this._eventStats.nextEvent ? this._eventStats.nextEvent : '';
    }

    get eventsSay (): string {
        return this._eventStats && this._eventStats.says ? this._eventStats.says : '';
    }

    get nickname (): string {
        return this._stats && this._stats.nickname ? this._stats.nickname : this.loading;
    }

    get nextDj (): string {
        return this._stats && this._stats.nextDj ? this._stats.nextDj : 'Not Booked';
    }

    get song (): string {
        return this._stats && this._stats.song ? this._stats.song : this.loading;
    }

    get likes (): number {
        return this._stats ? this._stats.likes : 0;
    }

    get djSays (): string {
        return this._stats ? this._stats.djSays : '';
    }

    get albumArt (): string {
        return this._stats ? this._stats.albumArt : '';
    }

    get eventsLink () : string {
        return this._eventStats.link ? this._eventStats.link : '';
    }
}
