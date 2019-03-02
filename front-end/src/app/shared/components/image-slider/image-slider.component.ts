import { Component } from '@angular/core';

@Component({
    selector: 'app-image-slider',
    templateUrl: 'image-slider.component.html',
    styleUrls: ['image-slider.component.css']
})

export class ImageSliderComponent {
    private _marginLeft = 0;

    constructor() {
        setInterval(() => {
            this._marginLeft = this._marginLeft === 300 ? 0 : this._marginLeft + 100;
        }, 10000);
    }

    get marginLeft(): string {
        return `-${this._marginLeft}%`;
    }
}
