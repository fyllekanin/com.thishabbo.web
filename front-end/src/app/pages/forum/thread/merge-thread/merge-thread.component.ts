import { Component } from '@angular/core';
import { InnerDialogComponent } from 'shared/app-views/dialog/dialog.model';

@Component({
    selector: 'app-forum-thread-merge-thread',
    templateUrl: 'merge-thread.component.html'
})
export class MergeThreadComponent extends InnerDialogComponent {
    private _threadId: number;
    private _thread: string;

    getData (): number {
        return this._threadId;
    }

    setData (): void {
        // Empty
    }

    set thread (value: string) {
        this._thread = String(value);
        this._threadId = this.getThreadId();
    }

    get thread (): string {
        return this._thread;
    }

    private getThreadId (): number {
        if (this._thread.match(/^[0-9]+$/)) {
            return Number(this._thread);
        }

        if (this._thread.match(/([0-9]+)/)) {
            return Number(this._thread.match(/([0-9]+)/)[0]);
        }

        return 0;
    }
}
