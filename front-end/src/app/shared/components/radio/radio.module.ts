import { NgModule } from '@angular/core';
import { RadioComponent } from 'shared/components/radio/radio.component';
import { RadioControlsComponent } from 'shared/components/radio/radio-controlls/radio-controls.component';
import { RequestComponent } from 'shared/components/radio/request/request.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RadioService } from './services/radio.service';
import { SafeStyleModule } from 'shared/pipes/safe-style/safe-style.module';
import { UserLinkModule } from 'shared/components/user/user-link.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        SafeStyleModule,
        UserLinkModule
    ],
    declarations: [
        RadioComponent,
        RadioControlsComponent,
        RequestComponent
    ],
    providers: [
        RadioService
    ],
    entryComponents: [
        RequestComponent
    ],
    exports: [
        RadioComponent,
        RadioControlsComponent
    ]
})
export class RadioModule {
}
