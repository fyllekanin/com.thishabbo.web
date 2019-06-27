import { Component, ElementRef, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Page } from 'shared/page/page.model';
import { ForumPermissions, SlimThread } from '../forum.model';
import { IUserProfile } from 'shared/directives/user-profile.directive';

@Component({
    selector: 'app-forum-slim-thread',
    templateUrl: 'slim-thread.component.html',
    styleUrls: ['slim-thread.component.css']
})

export class SlimThreadComponent extends Page implements OnDestroy {
    private _slimThread: SlimThread = new SlimThread();

    @Input() forumPermissions: ForumPermissions;
    @Output() onCheckChanged: EventEmitter<number> = new EventEmitter();

    @Input() isChecked: boolean;

    constructor(
        private _router: Router,
        elementRef: ElementRef
    ) {
        super(elementRef);
    }

    ngOnDestroy(): void {
        super.destroy();
    }

    goToLastPost(): void {
        const lastPost = this._slimThread.lastPost;
        this._router.navigateByUrl(`/forum/thread/${this._slimThread.threadId}/page/${lastPost.page}?scrollTo=post-${lastPost.postId}`);
    }

    onCheck(): void {
        this.onCheckChanged.emit(this._slimThread.threadId);
    }

    @Input()
    set thread(thread: SlimThread) {
        this._slimThread = thread || new SlimThread();
    }

    get canSelectThreads(): boolean {
        return this.forumPermissions && (
            this.forumPermissions.canMoveThreads || this.forumPermissions.canChangeOwner);
    }

    get title(): string {
        return this._slimThread.title;
    }

    get threadUrl(): string {
        return `/forum/thread/${this._slimThread.threadId}/page/1`;
    }

    get isClosed(): boolean {
        return !this._slimThread.isOpen;
    }

    get isApproved(): boolean {
        return this._slimThread.isApproved;
    }

    get isSticky(): boolean {
        return this._slimThread.isSticky;
    }

    get thread(): SlimThread {
        return this._slimThread;
    }

    get lastPostInfo(): IUserProfile {
        return { userId: this.thread.lastPost.user.userId, avatarUpdatedAt: this.thread.lastPost.user.avatarUpdatedAt };
    }

    get views(): number {
        return this._slimThread.views;
    }

    get posts(): number {
        return this._slimThread.posts;
    }

    get haveRead(): boolean {
        return this._slimThread.haveRead;
    }
}
