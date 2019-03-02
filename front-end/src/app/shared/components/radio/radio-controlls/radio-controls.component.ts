import { Component } from '@angular/core';
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

    isPlaying = false;

    constructor(
        private _radioService: RadioService,
        continuesInformationService: ContinuesInformationService
    ) {
        continuesInformationService.onContinuesInformation.subscribe(continuesInformation => {
            this._data = continuesInformation.radio;
        });
    }

    get listeners(): number {
        return this._data ? this._data.listeners : 0;
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
