import { NgModule } from '@angular/core';
import { ContentTabsComponent } from 'shared/app-views/content-tabs/content-tabs.component';
import { CommonModule } from '@angular/common';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        ContentTabsComponent
    ],
    exports: [
        ContentTabsComponent
    ]
})
export class ContentTabsModule {
}
