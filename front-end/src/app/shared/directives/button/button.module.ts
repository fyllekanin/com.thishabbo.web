import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonDirective } from 'shared/directives/button/button.directive';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        ButtonDirective
    ],
    exports: [
        ButtonDirective
    ]
})
export class ButtonModule {
}
