import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiteMessagesComponent } from 'shared/app-views/site-messages/site-messages.component';
import { InfoBoxModule } from 'shared/app-views/info-box/info-box.module';

@NgModule({
    imports: [
        CommonModule,
        InfoBoxModule
    ],
    declarations: [
        SiteMessagesComponent
    ],
    exports: [
        SiteMessagesComponent
    ]
})
export class SiteMessagesModule {
}
