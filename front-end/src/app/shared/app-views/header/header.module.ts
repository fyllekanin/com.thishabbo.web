import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from 'shared/app-views/header/header.component';
import { NgModule } from '@angular/core';
import { RadioModule } from 'shared/components/radio/radio.module';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        RouterModule,
        FormsModule,
        CommonModule,
        RadioModule
    ],
    declarations: [
        HeaderComponent
    ],
    exports: [
        HeaderComponent
    ]
})

export class HeaderModule {}
