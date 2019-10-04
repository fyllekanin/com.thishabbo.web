import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CATEGORY_SORT_BY, CategoryDisplayOptions, SORT_ORDER, TIME_CONSTRAINTS } from '../category.model';
import { StringHelper } from 'shared/helpers/string.helper';
import { TitleTab } from 'shared/app-views/title/title.model';

@Component({
    selector: 'app-forum-category-sorting',
    templateUrl: 'sorting.component.html',
    styleUrls: [ 'sorting.component.css' ]
})
export class SortingComponent {
    @Output() onSort: EventEmitter<CategoryDisplayOptions> = new EventEmitter();
    @Input() options: CategoryDisplayOptions = new CategoryDisplayOptions();

    sortedByOptions: Array<{ label: string, value: string }> = [];
    sortOrderOptions: Array<{ label: string, value: string }> = [];
    fromTheOptions: Array<{ label: string, value: string }> = [];
    tabs: Array<TitleTab> = [
        new TitleTab({ title: 'Show Threads' })
    ];

    constructor () {
        this.sortedByOptions = Object.keys(CATEGORY_SORT_BY).map(key => ({
            label: StringHelper.prettifyString(key),
            value: key
        }));
        this.sortOrderOptions = Object.keys(SORT_ORDER).map(key => ({
            label: StringHelper.prettifyString(key),
            value: key
        }));
        this.fromTheOptions = Object.keys(TIME_CONSTRAINTS).map(key => {
            return {
                label: TIME_CONSTRAINTS[key],
                value: key
            };
        });
    }

    sortThreads (): void {
        this.onSort.emit(this.options);
    }
}
