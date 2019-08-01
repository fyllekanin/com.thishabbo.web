import { SlimCategory, SlimPost, ThreadRedirect } from '../forum.model';
import { Component, ElementRef, Input, OnDestroy } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { IUserProfile } from 'shared/directives/user-profile.directive';

@Component({
    selector: 'app-forum-slim-category',
    templateUrl: 'slim-category.component.html',
    styleUrls: ['slim-category.component.css']
})

export class SlimCategoryComponent extends Page implements OnDestroy {
    private _slimCategory = new SlimCategory();

    lastPostInfo: IUserProfile;

    constructor (
        elementRef: ElementRef
    ) {
        super(elementRef);
    }

    ngOnDestroy (): void {
        super.destroy();
    }

    @Input()
    set category (category: SlimCategory) {
        this._slimCategory = category || new SlimCategory();
        this.lastPostInfo = this.lastPost ?
            {userId: this.lastPost.user.userId, avatarUpdatedAt: this.lastPost.user.avatarUpdatedAt} : null;
    }

    get categoryId (): number {
        return this._slimCategory.categoryId;
    }

    get title (): string {
        return this._slimCategory.title;
    }

    get description (): string {
        return this._slimCategory.description;
    }

    get threads (): number {
        return this._slimCategory.threads;
    }

    get posts (): number {
        return this._slimCategory.posts;
    }

    get lastPost (): SlimPost {
        return this._slimCategory.lastPost;
    }

    get lastPostRedirect (): ThreadRedirect {
        return this._slimCategory.lastPostRedirect;
    }

    get children (): Array<SlimCategory> {
        return this._slimCategory.children;
    }

    get icon (): string {
        return this._slimCategory.icon || 'fas fa-comment-alt';
    }

    get haveRead (): boolean {
        return this._slimCategory.haveRead;
    }
}
