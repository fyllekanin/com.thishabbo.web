import { NgModule } from '@angular/core';
import { ReasonComponent } from './reason.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@NgModule({
    imports: [
        CommonModule,
        FormsModule
    ],
    declarations: [
        ReasonComponent
    ],
    entryComponents: [
        ReasonComponent
    ],
    exports: [
        ReasonComponent
    ]
})
export class ReasonModule {}
