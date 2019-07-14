import { EditorComponent } from 'shared/components/editor/editor.component';
import { EditorAction } from 'shared/components/editor/editor.model';
import { AuthService } from 'core/services/auth/auth.service';
import { ForumPermissions } from '../forum.model';
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
import { SlimUser, User } from 'core/services/auth/auth.model';
import { PostService } from '../services/post.service';
import { DialogService } from 'core/services/dialog/dialog.service';
import { ReportComponent } from './report/report.component';
import { DialogButton, DialogCloseButton } from 'shared/app-views/dialog/dialog.model';
import { InfractionService } from 'shared/components/infraction/infraction.service';
import { LOCAL_STORAGE } from 'shared/constants/local-storage.constants';

@Component({
    selector: 'app-forum-post',
    templateUrl: 'post.component.html',
    styleUrls: ['post.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class PostComponent extends Page implements OnDestroy {
    private _postModel: PostModel = new PostModel();
    private _forumPermission: ForumPermissions = new ForumPermissions();
    private _isInEditMode = false;
    private _isMultiQuoted = false;
    private _quoteRegex = new RegExp('\\[quotepost(.*)quotepost\\]', 'gs');

    @ViewChild('editor', {static: false}) editor: EditorComponent;
    @Input() canPost: boolean;
    @Output() onUpdatePost: EventEmitter<PostModel> = new EventEmitter();
    @Output() onQuotePost: EventEmitter<string> = new EventEmitter();
    @Output() onMultiQuotePost: EventEmitter<PostModel> = new EventEmitter();


    visibleLikers: Array<SlimUser> = [];
    moreLikerNames: Array<SlimUser> = [];
    editorButtons: Array<EditorAction> = [
        new EditorAction({title: 'Save', value: PostActions.SAVE, saveCallback: this.onSave.bind(this)}),
        new EditorAction({title: 'Back', value: PostActions.BACK})
    ];

    constructor (
        private _authService: AuthService,
        private _service: PostService,
        private _dialogService: DialogService,
        private _componentFactory: ComponentFactoryResolver,
        private _infractionService: InfractionService,
        elementRef: ElementRef
    ) {
        super(elementRef);
    }

    ngOnDestroy (): void {
        super.destroy();
    }

    infract (): void {
        this._infractionService.infract(this._postModel.user.userId);
    }

    reportPost (): void {
        this._dialogService.openDialog({
            title: `Reporting post by: ${this.user.nickname}`,
            component: this._componentFactory.resolveComponentFactory(ReportComponent),
            buttons: [
                new DialogCloseButton('Close'),
                new DialogButton({title: 'Report', callback: this.onReport.bind(this)})
            ]
        });
    }

    likePost (): void {
        this._service.likePost(this._postModel.postId).subscribe(data => {
            this._postModel.likers = data;
        });

    }

    unlikePost (): void {
        this._service.unlikePost(this._postModel.postId).subscribe(data => {
            this._postModel.likers = data;
        });
    }

    editPost (): void {
        this._isInEditMode = true;
    }

    quotePost (): void {
        const content = this._postModel.content.replace(this._quoteRegex, '');
        this.onQuotePost.emit(`[quotepost=${this._postModel.postId}]Originally Posted by [b]${this.user.nickname}[/b]
${content}[/quotepost]\n\r`);
    }

    multiQuotePost (): void {
        this.onMultiQuotePost.emit(this._postModel);
        this._isMultiQuoted = true;
    }

    unMultiQuotePost (): void {
        this.onMultiQuotePost.emit(this._postModel);
        this._isMultiQuoted = false;
    }

    onButtonClick (button: EditorAction): void {
        switch (button.value) {
            case PostActions.BACK:
                this._isInEditMode = false;
                break;
            case PostActions.SAVE:
                this.onSave();
                break;
        }
    }

    getMoreLikerNames (): string {
        return this.moreLikerNames.reduce((prev, curr) => {
            return prev + (prev.length === 0 ? curr.nickname : `, ${curr.nickname}`);
        }, '');
    }

    @Input()
    set postModel (postModel: PostModel) {
        this._postModel = postModel || new PostModel();
        this.setLikers();
    }

    @Input()
    set forumPermissions (forumPermissions: ForumPermissions) {
        this._forumPermission = forumPermissions || new ForumPermissions();
    }

    get canGiveInfraction (): boolean {
        return this._authService.sitecpPermissions.canDoInfractions &&
            this._postModel.user.userId !== this._authService.authUser.userId;
    }

    get ignoreSignatures (): boolean {
        return Boolean(localStorage.getItem(LOCAL_STORAGE.IGNORE_SIGNATURES));
    }

    get signature (): string {
        return this.user.signature;
    }

    get haveLikers (): boolean {
        return this._postModel.likers.length > 0;
    }

    get canEditPost (): boolean {
        return (this._forumPermission.canEditOthersPosts ||
            (this._authService.isLoggedIn() && this._authService.authUser.userId === this.user.userId)) && !this._isInEditMode;
    }

    get haveLiked (): boolean {
        return this._postModel.likers.findIndex(liker => liker.userId === this._authService.authUser.userId) > -1;
    }

    get canInteractWithPost (): boolean {
        return (this._authService.isLoggedIn() && this._authService.authUser.userId !== this.user.userId);
    }

    get user (): User {
        return this._postModel.user;
    }

    get content (): string {
        return this._postModel.content;
    }

    get parsedContent (): string {
        return this._postModel.parsedContent;
    }

    get isInEditMode (): boolean {
        return this._isInEditMode;
    }

    get postId (): number {
        return this._postModel.postId;
    }

    get isMultiQuoted (): boolean {
        return this._isMultiQuoted;
    }

    private setLikers (): void {
        this.visibleLikers = this._postModel.likers.slice(0, 4);
        this.moreLikerNames = this._postModel.likers.slice(4, this._postModel.likers.length);
    }

    private onReport (message: string): void {
        this._service.reportPost(this._postModel.postId, message).subscribe(() => {
            this._dialogService.closeDialog();
        });
    }

    private onSave (): void {
        this._isInEditMode = false;
        this._postModel.content = this.editor.getEditorValue();
        this.onUpdatePost.emit(this._postModel);
    }
}
