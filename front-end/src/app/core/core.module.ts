import { DialogService } from 'core/services/dialog/dialog.service';
import { NotificationService } from 'core/services/notification/notification.service';
import { HttpClientModule } from '@angular/common/http';
import { httpInterceptorProviders } from 'core/services/auth/interceptors/interceptor.collection';
import { HttpService } from 'core/services/http/http.service';
import { AuthService } from 'core/services/auth/auth.service';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { RouterStateService } from 'core/services/router/router-state.service';
import { UserService } from 'core/services/user/user.service';

@NgModule({
    imports: [
        HttpClientModule
    ],
    declarations: [],
    providers: [],
    exports: []
})

export class CoreModule {
    static forRoot (): ModuleWithProviders {
        return {
            ngModule: CoreModule,
            providers: [
                httpInterceptorProviders,
                HttpService,
                AuthService,
                NotificationService,
                DialogService,
                BreadcrumbService,
                RouterStateService,
                UserService
            ]
        };
    }
}
