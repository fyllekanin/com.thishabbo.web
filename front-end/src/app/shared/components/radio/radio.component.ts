import { Component, Input } from '@angular/core';
import { EventsModel, RadioModel } from 'shared/components/radio/radio.model';
import { RadioService } from './services/radio.service';
import { LOCAL_STORAGE } from 'shared/constants/local-storage.constants';
import { ContinuesInformationService } from 'core/services/continues-information/continues-information.service';

@Component({
    selector: 'app-radio',
    templateUrl: 'radio.component.html',
    styleUrls: ['radio.component.css']
})
export class RadioComponent {
    private _stats: RadioModel;
    private _eventStats: EventsModel;
    private readonly loading = 'Loading...';

    isMinimalistic: boolean;

    constructor(
        private _radioService: RadioService,
        continuesInformationService: ContinuesInformationService
    ) {
        this.isMinimalistic = Boolean(localStorage.getItem(LOCAL_STORAGE.MINIMALISTIC));
        continuesInformationService.onDeviceSettingsUpdated.subscribe(() => {
            this.isMinimalistic = Boolean(localStorage.getItem(LOCAL_STORAGE.MINIMALISTIC));
        });
    }

    @Input()
    set stats(stats: RadioModel) {
        this._stats = stats;
    }

    @Input()
    set eventStats(stats: EventsModel) {
        this._eventStats = stats;
    }

    openRequest(): void {
        this._radioService.openRequest();
    }

    likeDj(): void {
        this._radioService.likeDj();
    }

    likeHost(): void {
        this._radioService.likeHost();
    }

    visitEvent(): void {
        window.open(this._eventStats.link, '_blank');
        window.focus();
    }

    get radioOffline(): boolean {
        return !this._stats || !this._stats.nickname;
    }

    get noEvent(): boolean {
        return !this._eventStats || !this._eventStats.nickname;

    }

    get currentHost(): string {
        return this._eventStats && this._eventStats.nickname ? this._eventStats.nickname : 'Not Booked';
    }

    get currentEvent(): string {
        return this._eventStats && this._eventStats.event ? this._eventStats.event : '';
    }

    get nextHost(): string {
        return this._eventStats && this._eventStats.nextHost ? this._eventStats.nextHost : 'Not Booked';
    }

    get nickname(): string {
        return this._stats && this._stats.nickname ? this._stats.nickname : this.loading;
    }

    get nextDj(): string {
        return this._stats && this._stats.nextDj ? this._stats.nextDj : 'Not Booked';
    }

    get song(): string {
        return this._stats && this._stats.song ? this._stats.song : this.loading;
    }

    get likes(): number {
        return this._stats ? this._stats.likes : 0;
    }

    get listeners(): number {
        return this._stats ? this._stats.listeners : 0;
    }

    get djSays(): string {
        return this._stats ? this._stats.djSays : '';
    }

    get albumArt(): string {
        return this._stats ? this._stats.albumArt : '';
    }

    get eventsLink(): string {
        return this._eventStats && this._eventStats.link ? this._eventStats.link : '';
    }
}
