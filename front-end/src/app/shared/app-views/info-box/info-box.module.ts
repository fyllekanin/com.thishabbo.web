import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfoBoxComponent } from 'shared/app-views/info-box/info-box.component';
import { SafeHtmlModule } from 'shared/pipes/safe-html/safe-html.module';

@NgModule({
    imports: [
        CommonModule,
        SafeHtmlModule
    ],
    declarations: [
        InfoBoxComponent
    ],
    exports: [
        InfoBoxComponent
    ]
})
export class InfoBoxModule {
}
