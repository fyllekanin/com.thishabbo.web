import { CommonModule } from '@angular/common';
import { NavigationComponent } from 'shared/app-views/navigation/navigation.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        RouterModule,
        CommonModule
    ],
    declarations: [
        NavigationComponent
    ],
    exports: [
        NavigationComponent
    ]
})

export class NavigationModule {
}
