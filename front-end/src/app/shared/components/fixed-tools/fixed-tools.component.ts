import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FixedTools, FixedToolItem } from 'shared/components/fixed-tools/fixed-tools.model';

@Component({
    selector: 'app-fixed-tools',
    templateUrl: 'fixed-tools.component.html',
    styleUrls: ['fixed-tools.component.css']
})
export class FixedToolsComponent {
    private _currentItem: FixedToolItem = null;
    private _tools: FixedTools = new FixedTools();
    private _BACK = -1;
    private _items: Array<FixedToolItem> = [];

    @Output() onAction: EventEmitter<number> = new EventEmitter();

    @Input()
    set tools(tools: FixedTools) {
        this._tools = tools;
        this.setItems();
    }

    onClick(item: FixedToolItem): void {
        if (item.value === this._BACK) {
            this._currentItem = this.findParent();
        } else if (item.children.length > 0) {
            this._currentItem = item;
        } else {
            this.onAction.emit(item.value);
            this._currentItem = null;
        }
        this.setItems();
    }

    get items(): Array<FixedToolItem> {
        return this._items;
    }

    private setItems(): void {
        if (!this._tools) {
            this._items = [];
            this._currentItem = null;
            return;
        }

        if (this._currentItem) {
            this._items = this._currentItem.children.concat([
                new FixedToolItem({ title: 'Back', value: this._BACK })
            ]);
            return;
        }
        this._items = this._tools.items;
    }

    private findParent(): FixedToolItem {
        const flatDeep = (arr: Array<FixedToolItem>): Array<FixedToolItem> => {
            return arr.reduce((acc, val) => Array.isArray(val) ? acc.concat(flatDeep(val)) : acc.concat([val]), []);
        };
        const items = flatDeep(this._tools.items);
        return items.find(item => {
            return item.children.findIndex(child => child.id === this._currentItem.id) > -1;
        });
    }
}
