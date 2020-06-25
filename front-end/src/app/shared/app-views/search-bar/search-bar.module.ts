import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SearchBarComponent } from './search-bar.component';
import { GlobalNotificationModule } from '../global-notification/global-notification.module';
import { FormsModule } from '@angular/forms';

@NgModule({
    imports: [
        RouterModule,
        GlobalNotificationModule,
        FormsModule
    ],
    declarations: [
        SearchBarComponent
    ],
    providers: [],
    exports: [
        SearchBarComponent
    ]
})
export class SearchBarModule {
}
