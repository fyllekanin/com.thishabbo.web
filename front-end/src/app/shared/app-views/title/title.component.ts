import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { TitleTab, TitleTopBorder } from 'shared/app-views/title/title.model';

@Component({
    selector: 'app-title',
    templateUrl: 'title.component.html',
    styleUrls: ['title.component.css']
})

export class TitleComponent {
    private _tabs: Array<TitleTab> = [];
    private _lastClick = 0;

    @Output() onTitleClick: EventEmitter<void> = new EventEmitter();
    @Output() onTabClick: EventEmitter<number> = new EventEmitter();
    @Output() onCheckboxChange: EventEmitter<boolean> = new EventEmitter();

    @Input() title: string;
    @Input() titlePointer = false;
    @Input() subTitle: string;
    @Input() checkbox: boolean;
    @Input() checkboxDisabled: boolean;
    @Input() checkboxValue = false;

    topBorder: TitleTopBorder = TitleTopBorder.BLUE;
    selectValue = null;

    constructor (private _router: Router) {
    }

    @Input()
    set tabs (tabs: Array<TitleTab>) {
        this._tabs = Array.isArray(tabs) ? tabs : [];
        this.selectValue = this.activeValue;
    }

    @Input()
    set top (top: TitleTopBorder) {
        this.topBorder = top || TitleTopBorder.BLUE;
    }

    onTabSelect (): void {
        if (!this.selectValue) {
            return;
        }
        if (this.selectValue.link) {
            this._router.navigateByUrl(this.selectValue.link);
        } else {
            this.onTabClick.emit(this.selectValue.value);
        }
        this.tabs = this._tabs.map(tab => new TitleTab(tab));
    }

    titleClick (): void {
        if (this._lastClick < (new Date().getTime() - 5000)) {
            this._lastClick = new Date().getTime();
            this.onTitleClick.emit();
        }
    }

    tabClick (tab: TitleTab): void {
        if (tab.link) {
            this._router.navigateByUrl(tab.link);
        } else {
            this.onTabClick.emit(tab.value);
        }
    }

    onSelectToggle (event): void {
        if (!this.checkboxDisabled) {
            this.onCheckboxChange.emit(event.target.checked);
        }
    }

    get tabs (): Array<TitleTab> {
        return this._tabs;
    }

    get activeValue (): number {
        const activeTab = this._tabs.find(item => item.isActive);
        return activeTab ? activeTab.value : null;
    }
}
