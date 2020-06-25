import { NgModule } from '@angular/core';
import { ImageLazyLoadDirective } from 'shared/directives/image-lazy-load/image-lazy-load.directive';

@NgModule({
    imports: [],
    declarations: [
        ImageLazyLoadDirective
    ],
    exports: [
        ImageLazyLoadDirective
    ]
})
export class ImageLazyLoadModule {
}

