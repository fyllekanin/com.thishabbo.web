import { DialogModule } from 'shared/app-views/dialog/dialog.module';
import { GlobalNotificationModule } from 'shared/app-views/global-notification/global-notification.module';
import { HeaderModule } from 'shared/app-views/header/header.module';
import { CoreModule } from 'core/core.module';
import { appRoutes } from './app.routes';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent, DummyComponent } from './app.component';
import { TopBarModule } from 'shared/app-views/top-bar/top-bar.module';
import { TopBoxModule } from 'shared/app-views/top-box/top-box.module';
import { AppLoadService } from 'core/loader/app-load.service';
import { SiteMessagesModule } from 'shared/app-views/site-messages/site-messages.module';
import { FooterModule } from 'shared/app-views/footer/footer.module';

export function init_app(appLoadService: AppLoadService) {
    return () => appLoadService.initializeApp();
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
        SiteMessagesModule,
        FooterModule
    ],
    declarations: [
        AppComponent,
        DummyComponent
    ],
    providers: [
        AppLoadService,
        { provide: APP_INITIALIZER, useFactory: init_app, deps: [AppLoadService], multi: true }
    ],
    bootstrap: [AppComponent]
})

export class AppModule {
}
