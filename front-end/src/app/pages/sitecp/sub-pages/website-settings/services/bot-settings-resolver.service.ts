import { BotSettingsModel } from '../bot-settings/bot-settings.model';
import { HttpService } from 'core/services/http/http.service';
import { Observable } from 'rxjs';
import { Resolve } from '@angular/router';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable()
export class BotSettingsResolver implements Resolve<BotSettingsModel> {

    constructor (private _httpService: HttpService) {
    }

    resolve (): Observable<BotSettingsModel> {
        return this._httpService.get('sitecp/content/bot-settings')
            .pipe(map(res => new BotSettingsModel(res)));
    }
}
