import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from 'shared/app-views/header/header.component';
import { NgModule } from '@angular/core';
import { RadioModule } from 'shared/components/radio/radio.module';
import { RouterModule } from '@angular/router';
import { TabsComponent } from 'shared/app-views/header/tabs/tabs.component';
import { TabComponent } from 'shared/app-views/header/tabs/tab/tab.component';
import { ActivitiesComponent } from 'shared/app-views/header/activities/activities.component';
import { UserLinkModule } from 'shared/components/user/user-link.module';
import { SearchBarModule } from '../search-bar/search-bar.module';

@NgModule({
    imports: [
        RouterModule,
        FormsModule,
        CommonModule,
        RadioModule,
        UserLinkModule,
        SearchBarModule
    ],
    declarations: [
        HeaderComponent,
        TabsComponent,
        TabComponent,
        ActivitiesComponent
    ],
    entryComponents: [
        TabComponent
    ],
    exports: [
        HeaderComponent
    ]
})

export class HeaderModule {
}
