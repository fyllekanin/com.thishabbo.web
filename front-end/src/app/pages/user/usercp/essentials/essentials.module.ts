import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ContentModule } from 'shared/app-views/content/content.module';
import { InfoBoxModule } from 'shared/app-views/info-box/info-box.module';
import { TitleModule } from 'shared/app-views/title/title.module';
import { EditorModule } from 'shared/components/editor/editor.module';
import { UserPostBitModule } from 'shared/components/user-post-bit/user-post-bit.module';
import { SafeHtmlModule } from 'shared/pipes/safe-html/safe-html.module';
import { SafeStyleModule } from 'shared/pipes/safe-style/safe-style.module';
import { AvatarComponent } from './avatar/avatar.component';
import { CoverPhotoComponent } from './cover-photo/cover-photo.component';
import { essentialsRoutes } from './essentials.routes';
import { NameSettingsComponent } from './name-settings/name-settings.component';
import { BadgesComponent } from './post-bit/badges/badges.component';
import { PostBitComponent } from './post-bit/post-bit.component';
import { ProfileComponent } from './profile/profile.component';
import { AvatarService } from './services/avatar.service';
import { NameSettingsService } from './services/name-settings.service';
import { PostBitService } from './services/post-bit.service';
import { ProfileService } from './services/profile.service';
import { SignatureService } from './services/signature.service';
import { SocialNetworksService } from './services/social-networks.service';
import { SignatureComponent } from './signature/signature.component';
import { SocialNetworksComponent } from './social-networks/social-networks.component';

@NgModule({
    imports: [
        RouterModule.forChild(essentialsRoutes),
        CommonModule,
        FormsModule,
        TitleModule,
        ContentModule,
        EditorModule,
        SafeStyleModule,
        SafeHtmlModule,
        InfoBoxModule,
        UserPostBitModule
    ],
    declarations: [
        AvatarComponent,
        CoverPhotoComponent,
        PostBitComponent,
        SignatureComponent,
        SocialNetworksComponent,
        ProfileComponent,
        BadgesComponent,
        NameSettingsComponent
    ],
    entryComponents: [BadgesComponent],
    providers: [
        AvatarService,
        PostBitService,
        SignatureService,
        SocialNetworksService,
        ProfileService,
        NameSettingsService
    ],
    exports: [RouterModule]
})
export class EssentialsModule {}
