import { Component, Input } from '@angular/core';
import { EventsModel, RadioModel } from 'shared/components/radio/radio.model';
import { RadioService } from './services/radio.service';
import { LOCAL_STORAGE } from 'shared/constants/local-storage.constants';
import { ContinuesInformationService } from 'core/services/continues-information/continues-information.service';
import { SlimUser } from 'core/services/auth/auth.model';

@Component({
    selector: 'app-radio',
    templateUrl: 'radio.component.html',
    styleUrls: [ 'radio.component.css' ]
})
export class RadioComponent {
    private _stats: RadioModel;
    private _eventStats: EventsModel;
    private _isPlaying = false;

    isMinimalistic: boolean;

    constructor (
        private _radioService: RadioService,
        continuesInformationService: ContinuesInformationService
    ) {
        this.isMinimalistic = Boolean(localStorage.getItem(LOCAL_STORAGE.MINIMALISTIC));
        continuesInformationService.onRadioPlayerToggle.subscribe(isPlaying => {
            this._isPlaying = isPlaying;
        });
        continuesInformationService.onDeviceSettingsUpdated.subscribe(() => {
            this.isMinimalistic = Boolean(localStorage.getItem(LOCAL_STORAGE.MINIMALISTIC));
        });
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

    get radioOffline (): boolean {
        return !this._stats || !this._stats.currentDj;
    }

    get noEvent (): boolean {
        return !this._eventStats || !this._eventStats.currentHost;
    }

    get currentHost (): SlimUser {
        return this._eventStats && this._eventStats.currentHost ? this._eventStats.currentHost : null;
    }

    get currentEvent (): string {
        return this._eventStats && this._eventStats.event ? this._eventStats.event : 'Not Booked';
    }

    get nextHost (): SlimUser {
        return this._eventStats && this._eventStats.nextHost ? this._eventStats.nextHost : null;
    }

    get nextEvent (): string {
        return this._eventStats && this._eventStats.nextEvent ? this._eventStats.nextEvent : 'Not Booked';
    }

    get currentDj (): SlimUser {
        return this._stats && this._stats.currentDj ? this._stats.currentDj : null;
    }

    get nextDj (): SlimUser {
        return this._stats && this._stats.nextDj ? this._stats.nextDj : null;
    }

    get song (): string {
        return this._stats && this._stats.song && this._isPlaying ? this._stats.song : 'Tune in to see the song...';
    }

    get likes (): number {
        return this._stats ? this._stats.likes : 0;
    }

    get listeners (): number {
        return this._stats ? this._stats.listeners : 0;
    }

    get djSays (): string {
        return this._stats ? this._stats.djSays : 'No DJ says has been set!';
    }

    get albumArt (): string {
        return this._stats ? this._stats.albumArt : '';
    }

    get eventsLink (): string {
        return this._eventStats && this._eventStats.link ? this._eventStats.link : '';
    }
}
