import { Component, Input } from '@angular/core';
import { SideMenuBlock } from 'shared/app-views/side-menu/side-menu.model';
import { TitleTab } from 'shared/app-views/title/title.model';
import { LOCAL_STORAGE } from 'shared/constants/local-storage.constants';

@Component({
    selector: 'app-side-menu',
    templateUrl: 'side-menu.component.html',
    styleUrls: [ 'side-menu.component.css' ]
})
export class SideMenuComponent {
    private _contractedMenuItems: Array<string> = [];
    private _blocks: Array<SideMenuBlock> = [];

    toggleTab: Array<TitleTab> = [
        new TitleTab({ title: 'Toggle' })
    ];

    constructor () {
        this._contractedMenuItems = this.getContractedMenuItems();
    }

    @Input()
    set blocks (items: Array<SideMenuBlock>) {
        this._blocks = Array.isArray(items) ? items : [];
    }

    get blocks (): Array<SideMenuBlock> {
        return this._blocks.filter(block => block.items.length > 0);
    }

    toggleMenuItem (title: string): void {
        if (this._contractedMenuItems.indexOf(title) > -1) {
            this._contractedMenuItems = this._contractedMenuItems.filter(item => item !== title);
        } else {
            this._contractedMenuItems.push(title);
        }
        this.updateContractedMenuItems();
    }

    isMenuItemContracted (title: string): boolean {
        return this._contractedMenuItems.indexOf(title) > -1;
    }

    private updateContractedMenuItems (): void {
        localStorage.setItem(LOCAL_STORAGE.CONTRACTED_MENU_ITEMS, JSON.stringify(this._contractedMenuItems));
    }

    private getContractedMenuItems (): Array<string> {
        const stored = localStorage.getItem(LOCAL_STORAGE.CONTRACTED_MENU_ITEMS);
        return stored ? JSON.parse(stored) : [];
    }
}
