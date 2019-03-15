import { DialogModule } from 'shared/app-views/dialog/dialog.module';
import { GlobalNotificationModule } from 'shared/app-views/global-notification/global-notification.module';
import { HeaderModule } from 'shared/app-views/header/header.module';
import { CoreModule } from 'core/core.module';
import { appRoutes } from './app.routes';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { TopBarModule } from 'shared/app-views/top-bar/top-bar.module';
import { TopBoxModule } from 'shared/app-views/top-box/top-box.module';
import { AppLoadService } from 'core/loader/app-load.service';
import { SiteMessagesModule } from 'shared/app-views/site-messages/site-messages.module';

export function init_nav(appLoadService: AppLoadService) {
    return () => appLoadService.initializeNavigation();
}

export function init_user(appLoadService: AppLoadService) {
    return () => appLoadService.initializeUser();
}

@NgModule({
    imports: [
        CoreModule.forRoot(),
        RouterModule.forRoot(appRoutes, {
            onSameUrlNavigation: 'reload',
            scrollPositionRestoration: 'enabled',
            anchorScrolling: 'enabled'
        }),
        BrowserModule,
        BrowserAnimationsModule,
        HeaderModule,
        GlobalNotificationModule,
        DialogModule,
        TopBarModule,
        TopBoxModule,
        SiteMessagesModule
    ],
    declarations: [
        AppComponent
    ],
    providers: [
        AppLoadService,
        { provide: APP_INITIALIZER, useFactory: init_nav, deps: [AppLoadService], multi: true },
        { provide: APP_INITIALIZER, useFactory: init_user, deps: [AppLoadService], multi: true }
    ],
    bootstrap: [AppComponent]
})

export class AppModule { }
