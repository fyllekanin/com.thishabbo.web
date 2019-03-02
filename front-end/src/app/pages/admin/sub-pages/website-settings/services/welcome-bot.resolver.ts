import { WelcomeBotModel } from '../welcome-bot/welcome-bot.model';
import { HttpService } from 'core/services/http/http.service';
import { Observable } from 'rxjs';
import { Resolve } from '@angular/router';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable()
export class WelcomeBotResolver implements Resolve<WelcomeBotModel> {

    constructor(private _httpService: HttpService) {}

    resolve(): Observable<WelcomeBotModel> {
        return this._httpService.get('admin/content/welcome-bot')
            .pipe(map(res => new WelcomeBotModel(res)));
    }
}
