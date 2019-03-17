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
import { UsercpAvatarService } from './services/usercp-avatar.service';
import { UsercpPostBitService } from './services/usercp-post-bit.service';
import { UsercpSignatureService } from './services/usercp-signature.service';
import { UsercpSocialNetworksService } from './services/usercp-social-networks.service';
import { essentialsRoutes } from './essentials.routes';
import { EditorModule } from 'shared/components/editor/editor.module';
import { SafeHtmlModule } from 'shared/pipes/safe-html/safe-html.module';

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
        SocialNetworksComponent
    ],
    providers: [
        UsercpAvatarService,
        UsercpPostBitService,
        UsercpSignatureService,
        UsercpSocialNetworksService
    ],
    exports: [
        RouterModule
    ]
})
export class EssentialsModule {}
