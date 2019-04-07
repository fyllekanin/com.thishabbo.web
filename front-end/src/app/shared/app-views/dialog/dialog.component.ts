import { Component, ComponentRef, HostBinding, HostListener, ViewChild, ViewContainerRef } from '@angular/core';
import { DialogService } from 'core/services/dialog/dialog.service';
import { DialogButton, DialogCloseButton, DialogConfig } from 'shared/app-views/dialog/dialog.model';

@Component({
    selector: 'app-dialog',
    templateUrl: 'dialog.component.html',
    styleUrls: [ 'dialog.component.css' ]
})
export class DialogComponent {
    private _config: DialogConfig;
    private _componentRef: ComponentRef<any>;
    private _buttons: Array<DialogButton | DialogCloseButton> = [];

    @HostBinding('class.visible') isVisible = false;
    @ViewChild('container', { read: ViewContainerRef }) container;

    constructor (
        dialogService: DialogService
    ) {
        dialogService.onDialogClose.subscribe(() => {
            this.isVisible = false;
        });
        dialogService.onDialogConfig.subscribe(config => {
            this.container.clear();
            this._config = config;
            if (this._config.component) {
                this._config.content = '';
                this.createComponent();
            }
            this.setButtons();
            this.isVisible = true;
        });
    }

    @HostListener('click', [ '$event' ])
    onClose (event): void {
        const isInsideWrapper = event.path
            .some(item => item.classList && item.classList.indexOf && item.classList.indexOf('wrapper') > -1);
        if (!isInsideWrapper) {
            this.isVisible = false;
        }
    }

    onButton (button: DialogButton | DialogCloseButton): void {
        if (button instanceof DialogCloseButton) {
            this.isVisible = false;
            return;
        }
        const arg = this._componentRef && this._componentRef.instance ? this._componentRef.instance.getData() : null;
        button.callback(arg);
    }

    get isComponent (): boolean {
        return Boolean(this._config && this._config.component);
    }

    get title (): string {
        return this._config ? this._config.title : '';
    }

    get content (): string {
        return this._config ? this._config.content : '';
    }

    get buttons (): Array<DialogButton | DialogCloseButton> {
        return this._buttons;
    }

    private setButtons(): void {
        const buttons = this._config.buttons || [];
        buttons.sort((a, _b) => {
            return a instanceof DialogCloseButton ? 1 : -1;
        });
        this._buttons = buttons;
    }

    private createComponent(): void {
        this._componentRef = this.container.createComponent(this._config.component);
        this._componentRef.instance.setData(this._config.data);
    }
}
