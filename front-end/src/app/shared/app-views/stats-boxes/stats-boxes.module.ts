import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentModule } from 'shared/app-views/content/content.module';
import { StatsBoxesComponent } from 'shared/app-views/stats-boxes/stats-boxes.component';

@NgModule({
    imports: [
        CommonModule,
        ContentModule
    ],
    declarations: [
        StatsBoxesComponent
    ],
    exports: [
        StatsBoxesComponent
    ]
})
export class StatsBoxesModule {}
