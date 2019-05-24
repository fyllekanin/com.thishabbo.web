import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { DialogButton, DialogCloseButton, DialogConfig, DialogConfirm } from 'shared/app-views/dialog/dialog.model';

@Injectable()
export class DialogService {
    private _dialogConfigSubject: Subject<DialogConfig> = new Subject();
    private _dialogCloseSubject: Subject<void> = new Subject();

    closeDialog (): void {
        this._dialogCloseSubject.next();
    }

    openDialog (config: DialogConfig) {
        this._dialogConfigSubject.next(config);
    }

    confirm (config: DialogConfirm): void {
        this.openDialog({
            title: config.title,
            content: config.content,
            buttons: [
                new DialogCloseButton('Close'),
                new DialogButton({title: 'Yes', callback: config.callback})
            ]
        });
    }

    get onDialogConfig (): Observable<DialogConfig> {
        return this._dialogConfigSubject.asObservable();
    }

    get onDialogClose (): Observable<void> {
        return this._dialogCloseSubject.asObservable();
    }
}
