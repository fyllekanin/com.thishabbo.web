import { DialogModule } from 'shared/app-views/dialog/dialog.module';
import { GlobalNotificationModule } from 'shared/app-views/global-notification/global-notification.module';
import { HeaderModule } from 'shared/app-views/header/header.module';
import { CoreModule } from 'core/core.module';
import { appRoutes } from './app.routes';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, ErrorHandler, NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { TopBarModule } from 'shared/app-views/top-bar/top-bar.module';
import { TopBoxModule } from 'shared/app-views/top-box/top-box.module';
import { AppLoadService } from 'core/loader/app-load.service';
import { SiteMessagesModule } from 'shared/app-views/site-messages/site-messages.module';
import { FooterModule } from 'shared/app-views/footer/footer.module';
import { ErrorHandlerService } from 'core/services/error/error-handler.service';

export function init_app (appLoadService: AppLoadService) {
    return () => appLoadService.initializeApp();
}

@NgModule({
    imports: [
        CoreModule.forRoot(),
        RouterModule.forRoot(appRoutes, {
            onSameUrlNavigation: 'reload',
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
        AppComponent
    ],
    providers: [
        AppLoadService,
        ErrorHandlerService,
        { provide: APP_INITIALIZER, useFactory: init_app, deps: [ AppLoadService ], multi: true },
        { provide: ErrorHandler, useClass: ErrorHandlerService }
    ],
    bootstrap: [ AppComponent ]
})

export class AppModule {
}
