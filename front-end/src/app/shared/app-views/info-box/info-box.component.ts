import { Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { INFO_BOX_TYPE, InfoBoxModel } from 'shared/app-views/info-box/info-box.model';

@Component({
    selector: 'app-info-box',
    templateUrl: 'info-box.component.html',
    styleUrls: ['info-box.component.css']
})
export class InfoBoxComponent {
    private _model: InfoBoxModel;

    @HostBinding('class.warning') isWarning = false;
    @HostBinding('class.info') isInfo = false;
    @HostBinding('class.alert') isAlert = false;

    @Input() isClosable = false;
    @Output() onClick: EventEmitter<any> = new EventEmitter();

    @Input()
    set model(model: InfoBoxModel) {
        this._model = model;
        this.checkType();
    }

    get title(): string {
        return this._model ? this._model.title : '';
    }

    get content(): string {
        return this._model ? this._model.content : '';
    }

    click(): void {
        this.onClick.emit(this._model.id);
    }

    private checkType(): void {
        this.isWarning = this._model.type === INFO_BOX_TYPE.WARNING;
        this.isInfo = this._model.type === INFO_BOX_TYPE.INFO;
        this.isAlert = this._model.type === INFO_BOX_TYPE.ALERT;
    }
}
