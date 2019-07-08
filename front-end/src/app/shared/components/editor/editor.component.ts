import { EditorAction, getEditorSettings } from 'shared/components/editor/editor.model';
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
import { HttpService } from 'core/services/http/http.service';
import { BBcodeModel } from '../../../pages/sitecp/sub-pages/content/bbcodes/bbcode.model';
import { IdHelper } from 'shared/helpers/id.helper';
import { LOCAL_STORAGE } from 'shared/constants/local-storage.constants';

@Component({
    selector: 'app-editor',
    templateUrl: 'editor.component.html',
    styleUrls: ['editor.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class EditorComponent implements AfterViewInit, OnDestroy {
    private _id = IdHelper.newUuid();
    private _editorActions: Array<EditorAction> = [];
    private _editorInstance = null;
    private _content: string;
    private _emojis: Array<BBcodeModel> = [];
    private _haveLoaded = false;
    private _keyUpTimer;

    @ViewChild('editor', {static: false}) editorEle;
    @Input() title = 'Editor';
    @Input() subTitle = '';
    @Input() slim = false;
    @Output() onTabClick: EventEmitter<EditorAction> = new EventEmitter();
    @Output() onKeyUp: EventEmitter<string> = new EventEmitter();
    @Output() onSave: EventEmitter<void> = new EventEmitter();

    tabs: Array<TitleTab> = [];
    bottomButtons: Array<EditorAction> = [];

    constructor (httpService: HttpService) {
        httpService.get('bbcode/emojis')
            .subscribe(res => {
                this._emojis = res.map(item => new BBcodeModel(item));
            }, () => {
            }, () => {
                this._haveLoaded = true;
                if (!this._editorInstance) {
                    this.ngAfterViewInit();
                }
            });
    }

    ngAfterViewInit (): void {
        this.editorEle.nativeElement.className = this._id;
        // @ts-ignore
        $(document).ready(() => {
            if (this._haveLoaded) {
                const settings = getEditorSettings(this._emojis, this.slim, this._id);
                // @ts-ignore
                this._editorInstance = $(`.${this._id}`).wysibb(settings);
                this.setMode();
                this.setShortcuts();
                this.content = this._content;
            }
        });
    }

    ngOnDestroy (): void {
        if (this._editorInstance) {
            this._editorInstance.destroy();
        }
    }

    getEditorValue (): string {
        const value = this._editorInstance ? this._editorInstance.getBBCode() : '';
        return value.replace(new RegExp(/(?:^|)(@)(?!\.)(?!\S*\.\.)(?!\S*\.[\s|$])([a-z0-9\.]+)(?=\s|$)/gmi), '[mention]@$2[/mention]');
    }

    onClick (value: number): void {
        this.onTabClick.emit({title: '', value: value});
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
                return new TitleTab({title: button.title, value: button.value});
            });

        if (this._editorInstance) {
            this.setShortcuts();
        }
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
            clearTimeout(this._keyUpTimer);
            setTimeout(() => {
                this.onKeyUp.emit(this.getEditorValue());
                if (e.altKey && e.keyCode === 83) {
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
            }, 200);
        });
    }
}
