import { Component, Input } from '@angular/core';
import { RadioModel } from 'shared/components/radio/radio.model';
import { RadioService } from './services/radio.service';

@Component({
    selector: 'app-radio',
    templateUrl: 'radio.component.html',
    styleUrls: ['radio.component.css']
})
export class RadioComponent {
    private _stats: RadioModel;
    private readonly loading = 'Loading...';

    constructor(
        private _radioService: RadioService
    ) {}

    @Input()
    set stats(stats: RadioModel) {
        this._stats = stats;
    }

    openRequest(): void {
        this._radioService.openRequest();
    }

    likeDj(): void {
        this._radioService.likeDj();
    }

    get nickname(): string {
        return this._stats && this._stats.nickname ? this._stats.nickname : this.loading;
    }

    get song(): string {
        return this._stats && this._stats.song ? this._stats.song : this.loading;
    }

    get likes(): number {
        return this._stats ? this._stats.likes : 0;
    }

    get djSays(): string {
        return this._stats ? this._stats.djSays : '';
    }

    get albumArt(): string {
        return this._stats ? this._stats.albumArt : '';
    }
}
