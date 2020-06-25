import { RouterModule } from '@angular/router';
import { PageComponent } from 'shared/page/page.component';
import { NgModule } from '@angular/core';

@NgModule({
    imports: [
        RouterModule
    ],
    declarations: [
        PageComponent
    ],
    providers: [],
    exports: [
        PageComponent
    ]
})

export class PageModule {
}
