import { FixedToolsComponent } from 'shared/components/fixed-tools/fixed-tools.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        FixedToolsComponent
    ],
    exports: [
        FixedToolsComponent
    ]
})
export class FixedToolsModule {}
