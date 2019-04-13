import { Routes } from '@angular/router';
import { SignatureComponent } from './signature/signature.component';
import { SignatureService } from './services/signature.service';
import { AvatarComponent } from './avatar/avatar.component';
import { AvatarService } from './services/avatar.service';
import { CoverPhotoComponent } from './cover-photo/cover-photo.component';
import { PostBitComponent } from './post-bit/post-bit.component';
import { PostBitService } from './services/post-bit.service';
import { SocialNetworksComponent } from './social-networks/social-networks.component';
import { SocialNetworksService } from './services/social-networks.service';
import { ProfileComponent } from './profile/profile.component';
import { ProfileService } from './services/profile.service';

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
    }
];
