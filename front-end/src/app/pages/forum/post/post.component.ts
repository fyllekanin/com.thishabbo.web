import { EditorComponent } from 'shared/components/editor/editor.component';
import { EditorAction } from 'shared/components/editor/editor.model';
import { AuthService } from 'core/services/auth/auth.service';
import { AutoSave, ForumPermissions } from '../forum.model';
import { PostActions, PostModel } from './post.model';
import { Page } from 'shared/page/page.model';
import {
    Component,
    ComponentFactoryResolver,
    ElementRef,
    EventEmitter,
    Input,
    OnDestroy,
    Output,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import { SlimUser } from 'core/services/auth/auth.model';
import { PostService } from '../services/post.service';
import { DialogService } from 'core/services/dialog/dialog.service';
import { ReportComponent } from './report/report.component';
import { DialogButton, DialogCloseButton } from 'shared/app-views/dialog/dialog.model';
import { InfractionService, InfractionType } from 'shared/components/infraction/infraction.service';
import { LOCAL_STORAGE } from 'shared/constants/local-storage.constants';
import { Router } from '@angular/router';
import { AutoSaveHelper } from 'shared/helpers/auto-save.helper';

@Component({
    selector: 'app-forum-post',
    templateUrl: 'post.component.html',
    styleUrls: [ 'post.component.css' ],
    encapsulation: ViewEncapsulation.None
})

export class PostComponent extends Page implements OnDestroy {
    private _forumPermission = new ForumPermissions();
    private _quoteRegex = /\[quotepost([\s\S]*)quotepost\]/g;

    @ViewChild('editor', { static: false }) editor: EditorComponent;
    @Input() canPost: boolean;
    @Output() onUpdatePost: EventEmitter<PostModel> = new EventEmitter();
    @Output() onQuotePost: EventEmitter<string> = new EventEmitter();
    @Output() onMultiQuotePost: EventEmitter<PostModel> = new EventEmitter();


    post = new PostModel();
    isInEditMode = false;
    isMultiQuoted = false;
    canGiveInfraction = false;
    moreLikerNames: string;
    visibleLikers: Array<SlimUser> = [];
    moreLikers: Array<SlimUser> = [];
    editorButtons: Array<EditorAction> = [
        new EditorAction({ title: 'Save', value: PostActions.SAVE, saveCallback: this.onSave.bind(this) }),
        new EditorAction({ title: 'Back', value: PostActions.BACK })
    ];

    constructor (
        private _authService: AuthService,
        private _service: PostService,
        private _dialogService: DialogService,
        private _componentFactory: ComponentFactoryResolver,
        private _infractionService: InfractionService,
        private _router: Router,
        elementRef: ElementRef
    ) {
        super(elementRef);
    }

    ngOnDestroy (): void {
        super.destroy();
    }

    filterPosts (): void {
        this._router.navigateByUrl(`/forum/thread/${this.post.threadId}/page/1/${this.post.user.nickname}`);
    }

    infract (): void {
        this._infractionService.infract(this.post.user.userId, InfractionType.POST, this.post.content);
    }

    reportPost (): void {
        this._dialogService.openDialog({
            title: `Reporting post by: ${this.post.user.nickname}`,
            component: this._componentFactory.resolveComponentFactory(ReportComponent),
            buttons: [
                new DialogCloseButton('Close'),
                new DialogButton({ title: 'Report', callback: this.onReport.bind(this) })
            ]
        });
    }

    likePost (): void {
        this._service.likePost(this.post.postId).subscribe(data => {
            this.post.likers = data;
            this.setLikers();
        });

    }

    unlikePost (): void {
        this._service.unlikePost(this.post.postId).subscribe(data => {
            this.post.likers = data;
            this.setLikers();
        });
    }

    editPost (): void {
        this.isInEditMode = true;
    }

    quotePost (): void {
        const content = this.post.content.replace(this._quoteRegex, '');
        this.onQuotePost.emit(`[quotepost=${this.post.postId}]Originally Posted by [b]${this.post.user.nickname}[/b]
${content}[/quotepost]\n`);
    }

    multiQuotePost (): void {
        this.onMultiQuotePost.emit(this.post);
        this.isMultiQuoted = true;
    }

    unMultiQuotePost (): void {
        this.onMultiQuotePost.emit(this.post);
        this.isMultiQuoted = false;
    }

    onButtonClick (button: EditorAction): void {
        switch (button.value) {
            case PostActions.BACK:
                this.isInEditMode = false;
                break;
            case PostActions.SAVE:
                this.onSave();
                break;
            case PostActions.AUTO_SAVE:
                this.onOpenAutoSave();
                break;
        }
    }

    onKeyUp (content: string): void {
        if (!content) {
            return;
        }

        AutoSaveHelper.save({
            type: AutoSave.POST_EDIT,
            contentId: this.post.postId,
            content: content
        });
    }

    @Input()
    set postModel (postModel: PostModel) {
        this.post = postModel || new PostModel();
        this.setLikers();

        this.canGiveInfraction = this._authService.sitecpPermissions.canDoInfractions &&
            this.post.user.userId !== this._authService.authUser.userId;
        this.moreLikerNames = this.moreLikers.reduce((prev, curr) => {
            return prev + (prev.length === 0 ? curr.nickname : `, ${curr.nickname}`);
        }, '');
        if (AutoSaveHelper.exists(AutoSave.POST_EDIT, this.post.postId) &&
            this.editorButtons.findIndex(button => button.value === PostActions.AUTO_SAVE) === -1) {
            this.editorButtons.push(new EditorAction({
                title: 'Open Auto-Save',
                value: PostActions.AUTO_SAVE
            }));
        }
    }

    @Input()
    set forumPermissions (forumPermissions: ForumPermissions) {
        if (!forumPermissions) {
            return;
        }
        this._forumPermission = forumPermissions;
    }

    get ignoreSignatures (): boolean {
        return Boolean(localStorage.getItem(LOCAL_STORAGE.IGNORE_SIGNATURES));
    }

    get haveLikers (): boolean {
        return this.post.likers.length > 0;
    }

    get canEditPost (): boolean {
        return (this._forumPermission.canEditOthersPosts ||
            (this._authService.isLoggedIn() && this._authService.authUser.userId === this.post.user.userId)) && !this.isInEditMode;
    }

    get haveLiked (): boolean {
        return this.post.likers.findIndex(liker => liker.userId === this._authService.authUser.userId) > -1;
    }

    get canInteractWithPost (): boolean {
        return (this._authService.isLoggedIn() && this._authService.authUser.userId !== this.post.user.userId);
    }

    private onOpenAutoSave (): void {
        const autoSave = AutoSaveHelper.get(AutoSave.POST_EDIT, this.post.postId);
        this.editor.content = autoSave.content;
        AutoSaveHelper.remove(AutoSave.POST_EDIT, this.post.postId);
        this.editorButtons = this.editorButtons.filter(button => button.value !== PostActions.AUTO_SAVE);
    }

    private setLikers (): void {
        this.visibleLikers = this.post.likers.slice(0, 4);
        this.moreLikers = this.post.likers.slice(4, this.post.likers.length);
    }

    private onReport (message: string): void {
        this._service.reportPost(this.post.postId, message).subscribe(() => {
            this._dialogService.closeDialog();
        });
    }

    private onSave (): void {
        this.post.content = this.editor.getEditorValue();
        this.isInEditMode = false;
        this.onUpdatePost.emit(this.post);
    }
}
