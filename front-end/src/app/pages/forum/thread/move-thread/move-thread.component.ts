import { Component } from '@angular/core';
import { InnerDialogComponent } from 'shared/app-views/dialog/dialog.model';
import { MoveThreadCategory } from './move-thread.model';
import { HttpService } from 'core/services/http/http.service';
import { ArrayHelper } from 'shared/helpers/array.helper';

@Component({
    selector: 'app-forum-thread-move',
    templateUrl: 'move-thread.component.html'
})
export class MoveThreadComponent extends InnerDialogComponent {
    private _data: Array<MoveThreadCategory> = [];

    categoryId = -1;

    constructor(httpService: HttpService) {
        super();
        httpService.get('forum/slim-categories')
            .subscribe(data => {
                this._data = ArrayHelper.flat(data.map(res => new MoveThreadCategory(res)));
            });
    }

    setData() {}

    getData() {
        return this.categoryId;
    }

    get items(): Array<{ title: string, categoryId: number }> {
        return this._data;
    }
}
