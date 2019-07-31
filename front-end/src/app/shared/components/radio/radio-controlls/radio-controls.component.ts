import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { RadioModel } from 'shared/components/radio/radio.model';
import { ContinuesInformationService } from 'core/services/continues-information/continues-information.service';
import { RadioService } from '../services/radio.service';
import { LOCAL_STORAGE } from 'shared/constants/local-storage.constants';
import { NotificationService } from 'core/services/notification/notification.service';

@Component({
    selector: 'app-radio-controls',
    templateUrl: 'radio-controls.component.html',
    styleUrls: ['radio-controls.component.css']
})
export class RadioControlsComponent implements AfterViewInit {
    private _data: RadioModel;
    private _radioUrl = '';

    @ViewChild('player', {static: true}) player: ElementRef<HTMLAudioElement>;
    isPlaying = false;
    volume = 1;

    constructor (
        private _radioService: RadioService,
        private _notificationService: NotificationService,
        private _continuesInformationService: ContinuesInformationService
    ) {
        this.volume = Number(localStorage.getItem(LOCAL_STORAGE.VOLUME)) || 1;
        _continuesInformationService.onContinuesInformation.subscribe(continuesInformation => {
            this._data = continuesInformation.radio;
            this._radioUrl = `${this._data.ip}:${this._data.port}/;stream.nsv`;
        });
    }

    get listeners (): number {
        return this._data ? this._data.listeners : 0;
    }

    get url (): string {
        return this._radioUrl;
    }

    ngAfterViewInit (): void {
        this.setVolume();
    }

    onVolumeChange (event): void {
        this.volume = Number(event.target.value);
        localStorage.setItem(LOCAL_STORAGE.VOLUME, String(this.volume));
        this.setVolume();
    }

    toggleAudio (): void {
        this.isPlaying = !this.isPlaying;
        this._continuesInformationService.radioPlayerToggle(this.isPlaying);
        if (this.isPlaying) {
            this.player.nativeElement.src = this.url;
            this.player.nativeElement.play().catch(() => {
                this._notificationService.sendErrorNotification('The radio could not start');
                this.isPlaying = false;
            });
        } else {
            this.player.nativeElement.pause();
            this.player.nativeElement.src = null;
        }
    }

    openRequest (): void {
        this._radioService.openRequest();
    }

    likeDj (): void {
        this._radioService.likeDj();
    }

    openInfo (): void {
        this._radioService.openInfo(this._data, this.isPlaying);
    }

    private setVolume (): void {
        this.player.nativeElement.volume = Number(this.volume / 100);
    }
}
