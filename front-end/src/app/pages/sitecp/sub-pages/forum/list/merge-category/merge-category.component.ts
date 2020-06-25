import { Component } from '@angular/core';
import { InnerDialogComponent } from 'shared/app-views/dialog/dialog.model';
import { ListCategory } from '../categories-list.model';
import { SelectItem } from 'shared/components/form/select/select.model';

@Component({
    selector: 'app-sitecp-categories-merge',
    templateUrl: 'merge-category.component.html'
})
export class MergeCategoryComponent extends InnerDialogComponent {
    category: ListCategory = null;
    categoryId: number = null;
    items: Array<SelectItem> = [];

    getData () {
        return this.categoryId;
    }

    setData (data: { categories: Array<ListCategory>, category: ListCategory }) {
        this.category = data.category;
        this.items = data.categories
            .filter(item => item.categoryId !== this.category.categoryId)
            .map(item => ({ label: item.title, value: item.categoryId }));
    }

    onValueChange (item: SelectItem): void {
        if (!item) {
            return;
        }
        this.categoryId = item.value;
    }
}
