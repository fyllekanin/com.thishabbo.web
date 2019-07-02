import { Injectable, Injector } from '@angular/core';
import { ForumAutoSave } from '../../pages/forum/forum.model';
import { AutoSaveHelper } from 'shared/helpers/auto-save.helper';
import { HttpService } from 'core/services/http/http.service';
import { LOCAL_STORAGE } from 'shared/constants/local-storage.constants';
import { AuthService } from 'core/services/auth/auth.service';
import { AuthUser } from 'core/services/auth/auth.model';
import { ThemeHelper } from 'shared/helpers/theme.helper';
import { RouterStateService } from 'core/services/router/router-state.service';

@Injectable()
export class AppLoadService {

    constructor (
        private _injector: Injector
    ) {
    }

    initializeApp (): Promise<any> {
        const httpService = this._injector.get(HttpService);
        const authService = this._injector.get(AuthService);
        const routerStateService = this._injector.get(RouterStateService);

        this.clearAutoSaves();
        routerStateService.pushUrl(location.pathname);

        return new Promise(resolve => {
            httpService.get('load/initial').subscribe(res => {
                localStorage.setItem(LOCAL_STORAGE.NAVIGATION, JSON.stringify(res.navigation));
                if (res.theme) {
                    ThemeHelper.applyTheme(res.theme);
                }
                if (authService.getAuthUser()) {
                    authService.user = res.user ? new AuthUser(res.user) : null;
                }
                resolve();
            }, resolve);
        });
    }

    private clearAutoSaves (): void {
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
