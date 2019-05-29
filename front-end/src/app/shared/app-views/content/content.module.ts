import { CommonModule } from '@angular/common';
import { ContentComponent } from 'shared/app-views/content/content.component';
import { NgModule } from '@angular/core';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        ContentComponent
    ],
    providers: [],
    exports: [
        ContentComponent
    ]
})

export class ContentModule {
}
