import { Routes } from '@angular/router';
import { AvatarComponent } from './avatar/avatar.component';
import { CoverPhotoComponent } from './cover-photo/cover-photo.component';
import { NameSettingsComponent } from './name-settings/name-settings.component';
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

export const essentialsRoutes: Routes = [
    {
        path: '',
        redirectTo: '../'
    },
    {
        path: 'signature',
        component: SignatureComponent,
        resolve: {
            data: SignatureService
        }
    },
    {
        path: 'avatar',
        component: AvatarComponent,
        resolve: {
            data: AvatarService
        }
    },
    {
        path: 'cover',
        component: CoverPhotoComponent
    },
    {
        path: 'post-bit',
        component: PostBitComponent,
        resolve: {
            data: PostBitService
        }
    },
    {
        path: 'social-networks',
        component: SocialNetworksComponent,
        resolve: {
            data: SocialNetworksService
        }
    },
    {
        path: 'profile',
        component: ProfileComponent,
        resolve: {
            data: ProfileService
        }
    },
    {
        path: 'name-settings',
        component: NameSettingsComponent,
        resolve: {
            data: NameSettingsService
        }
    }
];
