import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentModule } from 'shared/app-views/content/content.module';
import { CoverPhotoWithAvatarComponent } from './cover-photo-with-avatar.component';
import { UsercpAvatarCoverPreviewService } from './usercp-avatar-cover-preview.service';

@NgModule({
    imports: [
        CommonModule,
        ContentModule
    ],
    declarations: [
        CoverPhotoWithAvatarComponent
    ],
    providers: [
        UsercpAvatarCoverPreviewService
    ],
    exports: [
        CoverPhotoWithAvatarComponent
    ]
})
export class CoverPhotoWithAvatarModule {}
