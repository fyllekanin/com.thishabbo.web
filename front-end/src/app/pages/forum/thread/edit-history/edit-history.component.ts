import { Component } from '@angular/core';
import { InnerDialogComponent } from 'shared/app-views/dialog/dialog.model';
import { PostHistoryModel } from '../thread.model';
import { TimeHelper } from 'shared/helpers/time.helper';

@Component({
    selector: 'app-forum-thread-edit-history',
    templateUrl: 'edit-history.component.html'
})
export class EditHistoryComponent implements InnerDialogComponent {
    private _data: Array<PostHistoryModel> = [];

    historyTimestamp = -1;
    edits: Array<{ label: string, timestamp: number }> = [];
    viewBBcode = false;

    getData () {
    }

    setData (history: Array<PostHistoryModel>) {
        this._data = history;
        this.edits = this._data.map(item => {
            return {
                label: `${TimeHelper.getLongDateWithTime(item.createdAt)} - ${item.user.nickname}`,
                timestamp: item.createdAt
            };
        });
    }

    get edit (): PostHistoryModel {
        return this._data.find(item => item.createdAt === Number(this.historyTimestamp));
    }
}
