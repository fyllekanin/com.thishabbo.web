import { Component } from '@angular/core';
import { InnerDialogComponent } from 'shared/app-views/dialog/dialog.model';
import { ThreadPage } from '../thread.model';
import {
    Action,
    TableAction,
    TableCell,
    TableConfig,
    TableHeader,
    TableRow
} from 'shared/components/table/table.model';
import { HttpService } from 'core/services/http/http.service';
import { map } from 'rxjs/operators';
import { ThreadBan } from './thread-bans.model';
import { NotificationService } from 'core/services/notification/notification.service';

@Component({
    selector: 'app-forum-thread-bans',
    templateUrl: 'thread-bans.component.html'
})
export class ThreadBansComponent extends InnerDialogComponent {
    private _data: ThreadPage;

    nickname: string;
    tableConfig = new TableConfig({
        isSlim: true
    });

    constructor (
        private _httpService: HttpService,
        private _notificationService: NotificationService
    ) {
        super();
    }

    onBan (): void {
        this._httpService.post(`forum/moderation/thread/bans/${this._data.threadId}`, {nickname: this.nickname})
            .pipe(map(res => res.map(item => new ThreadBan(item))))
            .subscribe(bans => {
                this._notificationService.sendInfoNotification('Ban added!');
                this.createOrUpdateTable(bans);
                this.nickname = '';
            }, this._notificationService.failureNotification.bind(this._notificationService));
    }

    onUnban (action: Action): void {
        this._httpService.delete(`forum/moderation/thread/bans/${action.rowId}`)
            .pipe(map(res => res.map(item => new ThreadBan(item))))
            .subscribe(bans => {
                this._notificationService.sendInfoNotification('Ban removed!');
                this.createOrUpdateTable(bans);
                this.nickname = '';
            }, this._notificationService.failureNotification.bind(this._notificationService));
    }

    setData (thread: ThreadPage) {
        this._data = thread;
        this._httpService.get(`forum/moderation/thread/bans/${thread.threadId}`)
            .pipe(map(res => res.map(item => new ThreadBan(item))))
            .subscribe(this.createOrUpdateTable.bind(this));
    }

    getData () {
        return this._data;
    }

    private createOrUpdateTable (bans: Array<ThreadBan>): void {
        this.tableConfig = new TableConfig({
            isSlim: true,
            headers: this.getTableHeaders(),
            rows: this.getTableRows(bans)
        });
    }

    private getTableRows (bans: Array<ThreadBan>): Array<TableRow> {
        return bans.map(item => new TableRow({
            id: String(item.threadBanId),
            cells: [
                new TableCell({title: item.user.nickname}),
                new TableCell({title: item.bannedBy.nickname}),
                new TableCell({title: item.bannedAt})
            ],
            actions: [
                new TableAction({title: 'Unban'})
            ]
        }));
    }

    private getTableHeaders (): Array<TableHeader> {
        return [
            new TableHeader({title: 'Nickname'}),
            new TableHeader({title: 'Banned By'}),
            new TableHeader({title: 'Banned At'})
        ];
    }
}
