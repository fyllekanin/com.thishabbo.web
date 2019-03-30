import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from 'shared/app-views/header/header.component';
import { NgModule } from '@angular/core';
import { RadioModule } from 'shared/components/radio/radio.module';
import { RouterModule } from '@angular/router';
import { TabsComponent } from 'shared/app-views/header/tabs/tabs.component';
import { TabComponent } from 'shared/app-views/header/tabs/tab/tab.component';

@NgModule({
    imports: [
        RouterModule,
        FormsModule,
        CommonModule,
        RadioModule
    ],
    declarations: [
        HeaderComponent,
        TabsComponent,
        TabComponent
    ],
    entryComponents: [
        TabComponent
    ],
    exports: [
        HeaderComponent
    ]
})

export class HeaderModule {}
