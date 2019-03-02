import { ImageSliderComponent } from 'shared/components/image-slider/image-slider.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        ImageSliderComponent
    ],
    providers: [],
    exports: [
        ImageSliderComponent
    ]
})

export class ImageSliderModule {}
