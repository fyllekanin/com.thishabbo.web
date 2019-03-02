import { ComponentFactory } from '@angular/core';
import { ClassHelper } from 'shared/helpers/class.helper';
import { Button, ButtonColor } from 'shared/directives/button/button.model';

export class DialogButton {
    title: string;
    type: ButtonColor = Button.BLUE;
    callback: (data?) => void;

    constructor (source: Partial<DialogButton>) {
        ClassHelper.assign(this, source);
    }
}

export class DialogCloseButton {
    title: string;
    type = Button.GRAY;

    constructor(title: string) {
        this.title = title;
    }
}

export abstract class InnerDialogComponent {
    abstract getData();

    abstract setData (data);
}

export interface DialogConfig {
    title: string;
    content?: string;
    buttons: Array<DialogButton | DialogCloseButton>;
    component?: ComponentFactory<any>;
    data?: any;
}
