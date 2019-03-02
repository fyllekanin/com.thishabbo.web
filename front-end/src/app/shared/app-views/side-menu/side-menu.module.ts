import { NgModule } from '@angular/core';
import { ContentModule } from 'shared/app-views/content/content.module';
import { TitleModule } from 'shared/app-views/title/title.module';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SideMenuComponent } from 'shared/app-views/side-menu/side-menu.component';

@NgModule({
    imports: [
        ContentModule,
        TitleModule,
        RouterModule,
        CommonModule
    ],
    declarations: [
        SideMenuComponent
    ],
    exports: [
        SideMenuComponent
    ]
})
export class SideMenuModule {}
