import { SlimCategory, SlimPost } from '../forum.model';
import { Component, Input, ElementRef, OnDestroy } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { IUserProfile } from 'shared/directives/user-profile.directive';

@Component({
    selector: 'app-forum-slim-category',
    templateUrl: 'slim-category.component.html',
    styleUrls: ['slim-category.component.css']
})

export class SlimCategoryComponent extends Page implements OnDestroy {
    private _slimCategory: SlimCategory = new SlimCategory();

    constructor(
        elementRef: ElementRef
    ) {
        super(elementRef);
    }

    ngOnDestroy(): void {
        super.destroy();
    }

    @Input()
    set category(category: SlimCategory) {
        this._slimCategory = category || new SlimCategory();
    }

    get categoryId(): number {
        return this._slimCategory.categoryId;
    }

    get title(): string {
        return this._slimCategory.title;
    }

    get description(): string {
        return this._slimCategory.description;
    }

    get threads(): number {
        return this._slimCategory.threads;
    }

    get posts(): number {
        return this._slimCategory.posts;
    }

    get lastPost(): SlimPost {
        return this._slimCategory.lastPost;
    }

    get lastPostInfo(): IUserProfile {
        return { userId: this.lastPost.user.userId, avatarUpdatedAt: this.lastPost.user.avatarUpdatedAt };
    }

    get children(): Array<SlimCategory> {
        return this._slimCategory.childs;
    }
}
