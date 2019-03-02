import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LazyLoadDirective } from 'shared/directives/lazy-load/lazy-load.directive';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        LazyLoadDirective
    ],
    exports: [
        LazyLoadDirective
    ]
})
export class LazyLoadModule {
}
