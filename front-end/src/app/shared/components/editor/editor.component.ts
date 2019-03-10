import { EditorAction } from 'shared/components/editor/editor.model';
import {
    AfterViewInit,
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    Output,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import { TitleTab } from 'shared/app-views/title/title.model';
import { LOCAL_STORAGE } from 'shared/constants/local-storage.constants';
import { HttpService } from 'core/services/http/http.service';
import { BBcodeModel } from '../../../pages/admin/sub-pages/content/bbcodes/bbcode.model';

@Component({
    selector: 'app-editor',
    templateUrl: 'editor.component.html',
    styleUrls: ['editor.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class EditorComponent implements AfterViewInit, OnDestroy {
    private _editorActions: Array<EditorAction> = [];
    private _editorInstance = null;
    private _content: string;
    private _emojis: Array<BBcodeModel> = [];
    private _haveLoaded = false;

    @ViewChild('editor') editorEle;
    @Input() title = 'Editor';
    @Input() subTitle = '';
    @Output() onTabClick: EventEmitter<EditorAction> = new EventEmitter();
    @Output() onKeyUp: EventEmitter<string> = new EventEmitter();

    tabs: Array<TitleTab> = [];
    bottomButtons: Array<EditorAction> = [];

    constructor(httpService: HttpService) {
        httpService.get('bbcode/emojis')
            .subscribe(res => {
                this._emojis = res.map(item => new BBcodeModel(item));
            }, () => {}, () => {
                this._haveLoaded = true;
                if (!this._editorInstance) {
                    this.ngAfterViewInit();
                }
            });
    }

    ngAfterViewInit(): void {
        if (this._haveLoaded) {
            window['sceditor'].create(this.editorEle.nativeElement, {
                format: 'bbcode',
                emoticonsEnabled: true,
                autoExpand: true,
                spellcheck: false,
                style: '/assets/editor/themes/content/default.min.css',
                emoticonsCompat: true,
                icons: 'material',
                toolbarExclude: 'ltr,rtl',
                emoticons: {
                    dropdown: this._emojis.slice(0, 12).reduce((prev, curr) => {
                        prev[curr.pattern] = `/rest/resources/images/emojis/${curr.bbcodeId}.gif`;
                        return prev;
                    }, {}),
                    more: this._emojis.slice(0, 36).reduce((prev, curr) => {
                        prev[curr.pattern] = `/rest/resources/images/emojis/${curr.bbcodeId}.gif`;
                        return prev;
                    }, {}),
                    hidden: this._emojis.reduce((prev, curr) => {
                        prev[curr.pattern] = `/rest/resources/images/emojis/${curr.bbcodeId}.gif`;
                        return prev;
                    }, {})
                }
            });

            this._editorInstance = window['sceditor'].instance(this.editorEle.nativeElement);
            this._editorInstance.keyUp(() => {
                this.onKeyUp.emit(this.getEditorValue());
            });
            this.setShortcuts();
            this.setMode();
            this.content = this._content;
        }
    }

    ngOnDestroy(): void {
        if (this._editorInstance) {
            this._editorInstance.destroy();
        }
    }

    getEditorValue(): string {
        const value = this._editorInstance ? this._editorInstance.val() : '';
        return value.replace(new RegExp(/@([a-zA-Z0-9]+)/gi), '[mention]@$1[/mention]');
    }

    onClick(value: number): void {
        this.onTabClick.emit({ title: '', value: value });
    }

    @Input()
    set content(content: string) {
        this._content = content || '';
        if (this._editorInstance) {
            this._editorInstance.val(content);
        }
    }

    @Input()
    set buttons(buttons: Array<EditorAction>) {
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

    private setMode(): void {
        const isSourceMode = Boolean(localStorage.getItem(LOCAL_STORAGE.EDITOR_MODE));
        this._editorInstance.sourceMode(isSourceMode);
    }

    private setShortcuts(): void {
        if (!this._editorInstance) {
            return;
        }
        this._editorInstance.unbind('keydown');
        this._editorActions.filter(button => button.saveCallback).forEach(button => {
            this._editorInstance.bind('keydown', e => {
                if (e.ctrlKey && e.keyCode === 83) {
                    e.preventDefault();
                    button.saveCallback();
                }
            });
        });
    }
}
