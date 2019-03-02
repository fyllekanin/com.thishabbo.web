import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ContentModule } from 'shared/app-views/content/content.module';
import { TitleModule } from 'shared/app-views/title/title.module';
import { PageModule } from 'shared/page/page.module';
import { SelectionComponent } from './selection/selection.component';
import { TimetableComponent } from './timetable.component';
import { SafeHtmlModule } from 'shared/pipes/safe-html/safe-html.module';

@NgModule({
    imports: [
        RouterModule,
        CommonModule,
        FormsModule,
        ContentModule,
        TitleModule,
        PageModule,
        SafeHtmlModule
    ],
    declarations: [
        TimetableComponent,
        SelectionComponent
    ],
    entryComponents: [
        SelectionComponent
    ],
    exports: [
        TimetableComponent,
        SelectionComponent
    ]
})
export class TimetableModule {}
