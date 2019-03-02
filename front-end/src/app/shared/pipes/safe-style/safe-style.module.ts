import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeStylePipe } from './safe-style.pipe';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        SafeStylePipe
    ],
    exports: [
        SafeStylePipe
    ]
})
export class SafeStyleModule {
}
