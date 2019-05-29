import { Component, ElementRef, ViewChild } from '@angular/core';
import { RadioModel } from 'shared/components/radio/radio.model';
import { ContinuesInformationService } from 'core/services/continues-information/continues-information.service';
import { RadioService } from '../services/radio.service';
import { LOCAL_STORAGE } from 'shared/constants/local-storage.constants';

@Component({
    selector: 'app-radio-controls',
    templateUrl: 'radio-controls.component.html',
    styleUrls: ['radio-controls.component.css']
})
export class RadioControlsComponent {
    private _data: RadioModel;
    private _radioUrl = '';

    @ViewChild('player', { static: true }) player: ElementRef<HTMLAudioElement>;
    isPlaying = false;
    volume = '0.5';

    constructor(
        private _radioService: RadioService,
        continuesInformationService: ContinuesInformationService
    ) {
        this.volume = localStorage.getItem(LOCAL_STORAGE.VOLUME);
        continuesInformationService.onContinuesInformation.subscribe(continuesInformation => {
            this._data = continuesInformation.radio;
            this._radioUrl = `${this._data.ip}:${this._data.port}/;stream.nsv`;
        });
    }

    get listeners(): number {
        return this._data ? this._data.listeners : 0;
    }

    get url(): string {
        return this._radioUrl;
    }

    onVolumeChange(event): void {
        const volume = event.target.value;
        localStorage.setItem(LOCAL_STORAGE.VOLUME, String(volume));

        this.player.nativeElement.volume = Number(volume / 100);
    }

    toggleAudio(): void {
        this.isPlaying = !this.isPlaying;
        if (this.isPlaying) {
            this.player.nativeElement.play();
        } else {
            this.player.nativeElement.pause();
            this.player.nativeElement.currentTime = 0;
        }
    }

    openRequest(): void {
        this._radioService.openRequest();
    }

    likeDj(): void {
        this._radioService.likeDj();
    }

    openInfo(): void {
        this._radioService.openInfo(this._data);
    }

}
