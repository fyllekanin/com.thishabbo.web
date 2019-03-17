import { Routes } from '@angular/router';
import { SignatureComponent } from './signature/signature.component';
import { UsercpSignatureService } from './services/usercp-signature.service';
import { AvatarComponent } from './avatar/avatar.component';
import { UsercpAvatarService } from './services/usercp-avatar.service';
import { CoverPhotoComponent } from './cover-photo/cover-photo.component';
import { PostBitComponent } from './post-bit/post-bit.component';
import { UsercpPostBitService } from './services/usercp-post-bit.service';
import { SocialNetworksComponent } from './social-networks/social-networks.component';
import { UsercpSocialNetworksService } from './services/usercp-social-networks.service';

export const essentialsRoutes: Routes = [
    {
        path: '',
        redirectTo: '../'
    },
    {
        path: 'signature',
        component: SignatureComponent,
        resolve: {
            data: UsercpSignatureService
        }
    },
    {
        path: 'avatar',
        component: AvatarComponent,
        resolve: {
            data: UsercpAvatarService
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
            data: UsercpPostBitService
        }
    },
    {
        path: 'social-networks',
        component: SocialNetworksComponent,
        resolve: {
            data: UsercpSocialNetworksService
        }
    }
];
