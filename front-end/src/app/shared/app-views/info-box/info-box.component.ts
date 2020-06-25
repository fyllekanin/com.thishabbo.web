import { Component, EventEmitter, HostBinding, Input, Output, TemplateRef } from '@angular/core';
import { InfoBoxModel } from 'shared/app-views/info-box/info-box.model';

@Component({
    selector: 'app-info-box',
    templateUrl: 'info-box.component.html',
    styleUrls: [ 'info-box.component.css' ]
})
export class InfoBoxComponent {
    private _model: InfoBoxModel;

    @HostBinding('class') typClass = '';

    @Input() isClosable = false;
    @Input() template: TemplateRef<any> = null;
    @Output() onClick: EventEmitter<any> = new EventEmitter();

    @Input()
    set model (model: InfoBoxModel) {
        this._model = model;
        this.checkType();
    }

    get title (): string {
        return this._model ? this._model.title : '';
    }

    get content (): string {
        return this._model ? this._model.content : '';
    }

    click (): void {
        this.onClick.emit(this._model.id);
    }

    private checkType (): void {
        if (!this._model) {
            return;
        }
        this.typClass = this._model.type;
    }
}
