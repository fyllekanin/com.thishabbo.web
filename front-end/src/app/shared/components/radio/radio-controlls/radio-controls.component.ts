import { Component, ElementRef, ViewChild } from '@angular/core';
import { RadioModel } from 'shared/components/radio/radio.model';
import { ContinuesInformationService } from 'core/services/continues-information/continues-information.service';
import { RadioService } from '../services/radio.service';

@Component({
    selector: 'app-radio-controls',
    templateUrl: 'radio-controls.component.html',
    styleUrls: ['radio-controls.component.css']
})
export class RadioControlsComponent {
    private _data: RadioModel;
    private _radioUrl = '';

    @ViewChild('player') player: ElementRef<HTMLAudioElement>;
    isPlaying = false;

    constructor(
        private _radioService: RadioService,
        continuesInformationService: ContinuesInformationService
    ) {
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
        const volume = Number(event.target.value) / 100;
        this.player.nativeElement.volume = volume;
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
