import { ComponentFactory } from '@angular/core';
import { ClassHelper } from 'shared/helpers/class.helper';
import { Button, ButtonColor } from 'shared/directives/button/button.model';

export class DialogButton {
    title: string;
    type: ButtonColor = Button.BLUE;
    callback: (data?) => void;
    triggerOnSubmit = false;

    constructor (source: Partial<DialogButton>) {
        ClassHelper.assign(this, source);
    }
}

export class DialogCloseButton {
    title: string;
    type = Button.GRAY;

    constructor (title: string) {
        this.title = title;
    }
}

export abstract class InnerDialogComponent {
    abstract getData ();

    abstract setData (data);

    onSubmit (): void {
        // To be overriden
    }
}

export interface DialogConfirm {
    title: string;
    content: string;
    callback: () => void;
    forced?: boolean;
}

export interface DialogConfig {
    title: string;
    content?: string;
    buttons: Array<DialogButton | DialogCloseButton>;
    component?: ComponentFactory<any>;
    data?: any;
    forced?: boolean;
}
