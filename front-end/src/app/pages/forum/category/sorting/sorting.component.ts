import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CATEGORY_SORT_BY, CategoryDisplayOptions, SORT_ORDER, TIME_CONSTRAINTS } from '../category.model';
import { StringHelper } from 'shared/helpers/string.helper';
import { TitleTab } from 'shared/app-views/title/title.model';

@Component({
    selector: 'app-forum-category-sorting',
    templateUrl: 'sorting.component.html',
    styleUrls: ['sorting.component.css']
})
export class SortingComponent {
    private _options: CategoryDisplayOptions = new CategoryDisplayOptions();

    tabs: Array<TitleTab> = [
        new TitleTab({title: 'Show Threads'})
    ];
    @Output() onSort: EventEmitter<CategoryDisplayOptions> = new EventEmitter();

    @Input()
    set options (options: CategoryDisplayOptions) {
        this._options = options;
    }

    get options (): CategoryDisplayOptions {
        return this._options;
    }

    get sortedByOptions (): Array<string> {
        return Object.keys(CATEGORY_SORT_BY);
    }

    get sortOrderOptions (): Array<string> {
        return Object.keys(SORT_ORDER);
    }

    get fromTheOptions (): Array<{ label: string, value: string }> {
        return Object.keys(TIME_CONSTRAINTS).map(key => {
            return {
                label: TIME_CONSTRAINTS[key],
                value: key
            };
        });
    }

    prettifyString (item: string): string {
        return StringHelper.prettifyString(item);
    }

    sortThreads (): void {
        this.onSort.emit(this._options);
    }
}
