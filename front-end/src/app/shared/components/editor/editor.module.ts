import { ContentModule } from 'shared/app-views/content/content.module';
import { CommonModule } from '@angular/common';
import { TitleModule } from 'shared/app-views/title/title.module';
import { EditorComponent } from 'shared/components/editor/editor.component';
import { NgModule } from '@angular/core';
import { ButtonModule } from 'shared/directives/button/button.module';

@NgModule({
    imports: [
        TitleModule,
        CommonModule,
        ContentModule,
        ButtonModule
    ],
    declarations: [
        EditorComponent
    ],
    providers: [],
    exports: [
        EditorComponent
    ]
})

export class EditorModule {}
