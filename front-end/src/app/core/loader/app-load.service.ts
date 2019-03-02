import { Injectable, Injector } from '@angular/core';
import { ForumAutoSave } from '../../pages/forum/forum.model';
import { AutoSaveHelper } from 'shared/helpers/auto-save.helper';
import { HttpService } from 'core/services/http/http.service';
import { LOCAL_STORAGE } from 'shared/constants/local-storage.constants';
import { AuthService } from 'core/services/auth/auth.service';
import { AuthUser } from 'core/services/auth/auth.model';

@Injectable()
export class AppLoadService {

    constructor(
       private _injector: Injector
    ) {}

    initializeNavigation(): Promise<any> {
        const httpService = this._injector.get(HttpService);
        this.clearAutoSaves();
        return new Promise(resolve => {
            httpService.get('settings/navigation').subscribe(res => {
                localStorage.setItem(LOCAL_STORAGE.NAVIGATION, JSON.stringify(res));
                resolve();
            }, resolve);
        });
    }

    initializeUser(): Promise<any> {
        const httpService = this._injector.get(HttpService);
        const authService = this._injector.get(AuthService);

        return new Promise(resolve => {
            if (!authService.getAuthUser()) {
                resolve();
                return;
            }
            httpService.get('auth/user').subscribe(res => {
                authService.user = new AuthUser(res);
                resolve();
            }, () => {
                authService.user = null;
                resolve();
            });
        });
    }

    private clearAutoSaves(): void {
        const currentTime = new Date().getTime() / 1000;
        Object.keys(localStorage).filter(key => key.indexOf(AutoSaveHelper.AUTO_SAVE_PREFIX) > -1)
            .forEach(key => {
                const value = localStorage.getItem(key);
                const parsed: ForumAutoSave = value ? JSON.parse(value) : null;
                if (!parsed || parsed.expiresAt < currentTime) {
                    localStorage.removeItem(key);
                }
            });
    }
}
