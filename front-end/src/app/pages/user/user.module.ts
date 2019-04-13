import { EditorModule } from './../../shared/components/editor/editor.module';
import { ProfileComponent } from './profile/profile.component';
import { PageModule } from 'shared/page/page.module';
import { RouterModule } from '@angular/router';
import { userRoutes } from './user.routes';
import { NgModule } from '@angular/core';
import { ProfileService } from './profile/profile.service';
import { CoverPhotoWithAvatarModule } from './cover/cover-photo-with-avatar.module';
import { TitleModule } from 'shared/app-views/title/title.module';
import { ContentModule } from 'shared/app-views/content/content.module';
import { CommonModule } from '@angular/common';
import { UserLinkModule } from 'shared/components/user/user-link.module';
import { UserProfileModule } from 'shared/directives/user-profile.module';

@NgModule({
    imports: [
        RouterModule.forChild(userRoutes),
        PageModule,
        CoverPhotoWithAvatarModule,
        TitleModule,
        ContentModule,
        CommonModule,
        EditorModule,
        UserLinkModule,
        UserProfileModule
    ],
    declarations: [
        ProfileComponent
    ],
    providers: [
        ProfileService
    ],
    exports: [
        RouterModule
    ]
})

export class UserModule {}
