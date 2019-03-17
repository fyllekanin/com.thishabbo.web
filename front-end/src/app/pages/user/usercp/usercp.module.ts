import { PageModule } from 'shared/page/page.module';
import { usercpRoutes } from './usercp.routes';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { UsercpComponent } from './usercp.component';
import { SideMenuModule } from 'shared/app-views/side-menu/side-menu.module';
import { CoverPhotoWithAvatarModule } from '../cover/cover-photo-with-avatar.module';

@NgModule({
    imports: [
        RouterModule.forChild(usercpRoutes),
        PageModule,
        SideMenuModule,
        CoverPhotoWithAvatarModule
    ],
    declarations: [
        UsercpComponent
    ],
    providers: [],
    exports: [
        RouterModule
    ]
})
export class UsercpModule {
}
