import { Component } from '@angular/core';
import { InnerDialogComponent } from 'shared/app-views/dialog/dialog.model';
import { TableCell, TableConfig, TableHeader, TableRow } from 'shared/components/table/table.model';
import { PaginationModel } from 'shared/app-views/pagination/pagination.model';
import { ThreadPostersModel } from './thread-posters.model';
import { HttpService } from 'core/services/http/http.service';

@Component({
    selector: 'app-forum-thread-posters',
    templateUrl: 'thread-posters.component.html'
})
export class ThreadPostersComponent extends InnerDialogComponent {
    private _threadId: number;
    private _data: ThreadPostersModel;

    tableConfig: TableConfig;
    pagination: PaginationModel;

    constructor(
        private _httpService: HttpService
    ) {
        super();
    }

    getData () {
        // Left empty intentioally
    }

    setData (threadId: number) {
        this._threadId = threadId;
        this.onGetData(1);
    }

    onGetData(page: number): void {
        this._httpService.get(`forum/thread/${this._threadId}/posters/page/${page}`)
            .subscribe(this.onData.bind(this));
    }

    private onData(data): void {
        this._data = new ThreadPostersModel(data);

        this.createOrUpdateTable();
        this.pagination = new PaginationModel({
            page: this._data.page,
            total: this._data.total
        });
    }

    private createOrUpdateTable(): void {
        this.tableConfig = new TableConfig({
            title: 'Thread Posters',
            headers: this.getTableHeaders(),
            rows: this.getTableRows(),
            isSlim: true
        });
    }

    private getTableRows(): Array<TableRow> {
        return this._data.items.map(item => new TableRow({
            cells: [
                new TableCell({ title: item.user.nickname }),
                new TableCell({ title: String(item.posts) })
            ]
        }));
    }

    private getTableHeaders(): Array<TableHeader> {
        return [
            new TableHeader({ title: 'User' }),
            new TableHeader({ title: 'Posts' })
        ];
    }
}
