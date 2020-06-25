import { CommonModule } from '@angular/common';
import { DialogComponent } from 'shared/app-views/dialog/dialog.component';
import { NgModule } from '@angular/core';
import { ButtonModule } from 'shared/directives/button/button.module';

@NgModule({
    imports: [
        CommonModule,
        ButtonModule
    ],
    declarations: [
        DialogComponent
    ],
    providers: [],
    exports: [
        DialogComponent
    ]
})
export class DialogModule {
}
