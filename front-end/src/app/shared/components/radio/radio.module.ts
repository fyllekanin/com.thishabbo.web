import { NgModule } from '@angular/core';
import { RadioComponent } from 'shared/components/radio/radio.component';
import { RadioControlsComponent } from 'shared/components/radio/radio-controlls/radio-controls.component';
import { RequestComponent } from 'shared/components/radio/request/request.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RadioService } from './services/radio.service';
import { SafeStyleModule } from 'shared/pipes/safe-style/safe-style.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        SafeStyleModule
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
export class RadioModule {}
