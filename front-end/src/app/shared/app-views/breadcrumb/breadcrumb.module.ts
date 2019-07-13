import { BreadcrumbComponent } from './breadcrumb.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SafeHtmlModule } from 'shared/pipes/safe-html/safe-html.module';

@NgModule({
    imports: [
        RouterModule,
        CommonModule,
        SafeHtmlModule
    ],
    declarations: [
        BreadcrumbComponent
    ],
    providers: [],
    exports: [
        BreadcrumbComponent
    ]
})
export class BreadcrumbModule {
}
