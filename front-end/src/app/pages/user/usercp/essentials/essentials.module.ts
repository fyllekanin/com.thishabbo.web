import { NgModule } from '@angular/core';
import { AvatarComponent } from './avatar/avatar.component';
import { CoverPhotoComponent } from './cover-photo/cover-photo.component';
import { PostBitComponent } from './post-bit/post-bit.component';
import { SignatureComponent } from './signature/signature.component';
import { SocialNetworksComponent } from './social-networks/social-networks.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TitleModule } from 'shared/app-views/title/title.module';
import { ContentModule } from 'shared/app-views/content/content.module';
import { AvatarService } from './services/avatar.service';
import { PostBitService } from './services/post-bit.service';
import { SignatureService } from './services/signature.service';
import { SocialNetworksService } from './services/social-networks.service';
import { essentialsRoutes } from './essentials.routes';
import { EditorModule } from 'shared/components/editor/editor.module';
import { SafeHtmlModule } from 'shared/pipes/safe-html/safe-html.module';
import { ProfileComponent } from './profile/profile.component';
import { ProfileService } from './services/profile.service';

@NgModule({
    imports: [
        RouterModule.forChild(essentialsRoutes),
        CommonModule,
        FormsModule,
        TitleModule,
        ContentModule,
        EditorModule,
        SafeHtmlModule
    ],
    declarations: [
        AvatarComponent,
        CoverPhotoComponent,
        PostBitComponent,
        SignatureComponent,
        SocialNetworksComponent,
        ProfileComponent
    ],
    providers: [
        AvatarService,
        PostBitService,
        SignatureService,
        SocialNetworksService,
        ProfileService
    ],
    exports: [
        RouterModule
    ]
})
export class EssentialsModule {}
