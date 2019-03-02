import { NgModule } from '@angular/core';
import { TopBoxComponent } from './top-box.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RadioModule } from 'shared/components/radio/radio.module';
import { NavigationModule } from 'shared/app-views/navigation/navigation.module';

@NgModule({
    imports: [
        RouterModule,
        CommonModule,
        RadioModule,
        NavigationModule
    ],
    declarations: [
        TopBoxComponent
    ],
    exports: [
        TopBoxComponent
    ]
})
export class TopBoxModule { }
