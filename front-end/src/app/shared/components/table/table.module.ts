import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ContentModule } from 'shared/app-views/content/content.module';
import { TitleModule } from 'shared/app-views/title/title.module';
import { TableComponent } from 'shared/components/table/table.component';
import { NgModule } from '@angular/core';
import { SafeHtmlModule } from 'shared/pipes/safe-html/safe-html.module';
import { ButtonModule } from 'shared/directives/button/button.module';
import { RouterModule } from '@angular/router';
import { SelectModule } from 'shared/components/form/select/select.module';

@NgModule({
    imports: [
        TitleModule,
        ContentModule,
        CommonModule,
        FormsModule,
        SafeHtmlModule,
        ButtonModule,
        RouterModule,
        SelectModule
    ],
    declarations: [
        TableComponent
    ],
    providers: [],
    exports: [
        TableComponent
    ]
})

export class TableModule {
}
