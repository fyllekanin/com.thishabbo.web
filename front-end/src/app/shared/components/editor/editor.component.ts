import { EditorAction, getEditorSettings } from 'shared/components/editor/editor.model';
import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnDestroy,
    Output,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import { TitleTab } from 'shared/app-views/title/title.model';
import { HttpService } from 'core/services/http/http.service';
import { IdHelper } from 'shared/helpers/id.helper';
import { LOCAL_STORAGE } from 'shared/constants/local-storage.constants';
import { StringHelper } from 'shared/helpers/string.helper';

@Component({
    selector: 'app-editor',
    templateUrl: 'editor.component.html',
    styleUrls: [ 'editor.component.css' ],
    encapsulation: ViewEncapsulation.None
})

export class EditorComponent implements AfterViewInit, OnDestroy {
    private _id = IdHelper.newUuid();
    private _editorActions: Array<EditorAction> = [];
    private _editorInstance = null;
    private _content: string;
    private _tagCheckTimeout;
    private _currentTag: string;
    private _matchSelectionIndex: number;
    private _currentCarrotPosition: number;
    private _currentCarrotNode: Node;
    private _isWaitingForSpace = false;
    private _userTurnedOffMentionSuggestions = false;
    private _autoSaveTimeout;

    @ViewChild('editor') editorEle;
    @Input() title = 'Editor';
    @Input() subTitle = '';
    @Input() slim = false;
    @Input() showMentionSuggestions = false;
    @Output() onTabClick: EventEmitter<EditorAction> = new EventEmitter();
    @Output() onKeyUp: EventEmitter<string> = new EventEmitter();
    @Output() onSave: EventEmitter<void> = new EventEmitter();

    tabs: Array<TitleTab> = [];
    bottomButtons: Array<EditorAction> = [];
    matches: Array<string> = [];

    constructor (
        private _httpService: HttpService,
        private _elementRef: ElementRef) {
    }

    ngAfterViewInit (): void {
        this.editorEle.nativeElement.className = this._id;
        // @ts-ignore
        $(document).ready(() => {
            const settings = getEditorSettings(this.slim, this._id);
            // @ts-ignore
            this._editorInstance = $(`.${this._id}`).wysibb(settings);
            this.setMode();
            this.setShortcuts();
            this.content = this._content;
        });
    }

    ngOnDestroy (): void {
        if (this._editorInstance) {
            this._editorInstance.destroy();
        }
    }

    getEditorValue (): string {
        return this._editorInstance ? this._editorInstance.getBBCode() : '';
    }

    onClick (value: number): void {
        this.onTabClick.emit({ title: '', value: value });
    }

    @Input()
    set content (content: string) {
        // @ts-ignore
        $(document).ready(() => {
            this._content = content || '';
            if (this._editorInstance) {
                this._editorInstance.bbcode(content);
            }
        });
    }

    @Input()
    set buttons (buttons: Array<EditorAction>) {
        this._editorActions = buttons;
        this.bottomButtons = (buttons || [])
            .filter(button => button.asButton);
        this.tabs = (buttons || [])
            .filter(button => !button.asButton)
            .map(button => {
                return new TitleTab({ title: button.title, value: button.value });
            });

        if (this._editorInstance) {
            this.setShortcuts();
        }
    }

    onMatchKey (e): void {
        if (!StringHelper.isKey(e, 'enter') && !StringHelper.isKey(e, 'arrowdown') && !StringHelper.isKey(e, 'arrowup')) {
            return;
        }
        e.preventDefault();
        e.stopPropagation();
        const maxLength = this.matches.length - 1;

        if (StringHelper.isKey(e, 'enter')) {
            this.insertTag();
            return;
        }

        if (StringHelper.isKey(e, 'arrowdown')) {
            this._matchSelectionIndex = this._matchSelectionIndex === maxLength ? this._matchSelectionIndex : this._matchSelectionIndex + 1;
        } else if (StringHelper.isKey(e, 'arrowup')) {
            this._matchSelectionIndex = this._matchSelectionIndex === 0 ? 0 : this._matchSelectionIndex - 1;
        }
        const elem = this._elementRef.nativeElement.querySelectorAll('.match')[this._matchSelectionIndex];
        if (elem) {
            elem.focus();
        }
    }

    private insertTag (): void {
        this._editorInstance.setCarrotPosition(this._currentCarrotNode, this._currentCarrotPosition);
        let selection = `${this.matches[this._matchSelectionIndex]}`;
        selection = selection.replace(new RegExp(this._currentTag, 'i'), '');
        this.resetMatches();
        this._editorInstance.insertAtCursor(selection, false);
        this._isWaitingForSpace = true;
    }

    private setMode (): void {
        const isSourceMode = Boolean(localStorage.getItem(LOCAL_STORAGE.EDITOR_MODE));
        if (isSourceMode && !this._editorInstance.isBBMode()) {
            this._editorInstance.modeSwitch(true);
        }
    }

    private setShortcuts (): void {
        if (!this._editorInstance) {
            return;
        }
        this._editorInstance.keybind('keyup', e => {
            if (this.shouldSwiftFocusToMatches(e)) {
                e.preventDefault();
                const elem = this._elementRef.nativeElement.querySelector('.match');
                if (elem) {
                    elem.focus();
                }
                return;
            }

            this.onKeyUp.emit(this.getEditorValue());
            if (!StringHelper.isKey(e, ' ') && !this._isWaitingForSpace &&
                this.showMentionSuggestions && !this._userTurnedOffMentionSuggestions) {
                this.checkForTags();
            } else {
                this._isWaitingForSpace = false;
            }
            if (e.altKey && StringHelper.isKey(e, 's')) {
                clearTimeout(this._autoSaveTimeout);
                this._autoSaveTimeout = setTimeout(() => this.onAutoSave(e), 200);
            }
        });
    }

    private shouldSwiftFocusToMatches (e): boolean {
        return !e.altKey && !e.ctrlKey && StringHelper.isKey(e, 'arrowdown') && this.matches.length > 0;
    }

    private checkForTags (): void {
        this.resetMatches();
        clearTimeout(this._tagCheckTimeout);
        this._tagCheckTimeout = setTimeout(() => {
            if (!window.getSelection() || window.getSelection().rangeCount < 1) {
                return;
            }
            this._currentCarrotPosition = window.getSelection().getRangeAt(0).startOffset;
            this._currentCarrotNode = window.getSelection().focusNode;
            const currentWord = this._editorInstance.getCurrentWordAtCarrot();
            if (currentWord && currentWord.startsWith('@') && currentWord.length > 1) {
                this._currentTag = currentWord.replace(/[^\w\s]/gi, '');
                this._httpService.get(`search/type/users/page/1?text=${this._currentTag}&order=desc&searchType=fromStart&isMentionSearch=true`)
                    .subscribe(response => {
                        const nicknames = response.items.map(item => item.title);
                        this.matches = nicknames.length > 5 ? nicknames.slice(0, 5) : nicknames;
                    });
            }
        }, 300);
    }

    private resetMatches (): void {
        this._matchSelectionIndex = 0;
        this.matches = [];
        this._currentTag = '';
        this._currentCarrotNode = null;
        this._currentCarrotPosition = 0;
    }

    private onAutoSave (e: Event): void {
        e.preventDefault();
        const callbacks = this._editorActions.filter(button => button.saveCallback);
        if (callbacks.length > 0) {
            callbacks.forEach(button => {
                button.saveCallback();
            });
        } else {
            this.onSave.emit();
        }
    }
}
