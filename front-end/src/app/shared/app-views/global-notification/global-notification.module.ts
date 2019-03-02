import { CommonModule } from '@angular/common';
import { GlobalNotificationComponent } from 'shared/app-views/global-notification/global-notification.component';
import { NgModule } from '@angular/core';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        GlobalNotificationComponent
    ],
    providers: [],
    exports: [
        GlobalNotificationComponent
    ]
})
export class GlobalNotificationModule {}
