import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TitleComponent } from 'shared/app-views/title/title.component';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        FormsModule
    ],
    declarations: [
        TitleComponent
    ],
    providers: [],
    exports: [
        TitleComponent
    ]
})

export class TitleModule {
}
