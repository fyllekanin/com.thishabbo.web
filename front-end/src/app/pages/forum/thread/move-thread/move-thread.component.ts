import { Component } from '@angular/core';
import { InnerDialogComponent } from 'shared/app-views/dialog/dialog.model';
import { MoveThreadCategory } from './move-thread.model';
import { HttpService } from 'core/services/http/http.service';
import { ArrayHelper } from 'shared/helpers/array.helper';
import { SelectItem } from 'shared/components/form/select/select.model';

@Component({
    selector: 'app-forum-thread-move',
    templateUrl: 'move-thread.component.html'
})
export class MoveThreadComponent extends InnerDialogComponent {
    private _data: Array<MoveThreadCategory> = [];

    categoryId = -1;
    items: Array<SelectItem> = [];

    constructor(httpService: HttpService) {
        super();
        httpService.get('forum/slim-categories')
            .subscribe(data => {
                this._data = ArrayHelper.flat(data.map(res => new MoveThreadCategory(res)));
                this.items = this._data.map(item => ({ label: item.title, value: item.categoryId }));
            });
    }

    setData() {
    }

    getData() {
        return this.categoryId;
    }
}
