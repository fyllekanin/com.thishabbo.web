import { Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
import { SelectItem } from 'shared/components/form/select/select.model';

@Component({
    selector: 'app-form-select',
    templateUrl: 'select.component.html',
    styleUrls: [ 'select.component.css' ]
})
export class SelectComponent {
    private _items: Array<SelectItem> = [];
    private _value: SelectItem = null;
    private _placeholder = 'Select...';

    isOpen = false;
    filter = '';
    placeholderText = this._placeholder;
    @Input() disabled;
    @Output() valueChange: EventEmitter<SelectItem> = new EventEmitter();

    @ViewChild('itemsList') itemsList;

    constructor (private _elementRef: ElementRef) {
    }

    @Input()
    set items (items: Array<SelectItem>) {
        this._items = Array.isArray(items) ? items : [];
    }

    @Input()
    set value (item: SelectItem) {
        this._value = item;
        this.updatePlaceHolderText();
    }

    get items (): Array<SelectItem> {
        return this._items.filter(item => item.label.toLowerCase().indexOf(this.filter.toLowerCase()) > -1);
    }

    @Input()
    set placeholder (str: string) {
        this._placeholder = str;
    }

    get textContent (): string {
        return this._items.length > 0 ? (this._value ? this._value.label : null) : 'No items...';
    }

    @HostListener('document:click', [ '$event' ])
    click (event) {
        if (!this._elementRef.nativeElement.contains(event.target) && this.isOpen) {
            this.isOpen = false;
        }
    }

    onFocus () {
        if (!this.disabled && this._items.length > 0) {
            this.isOpen = true;
        }
    }

    onValueChanged (item: SelectItem) {
        this._value = item;
        this.updatePlaceHolderText();
        this.isOpen = false;
        this.valueChange.emit(this._value);
    }

    checkIfEmpty (): void {
        if (this.filter === '') {
            this._value = null;
            this.valueChange.emit(this._value);
        }
    }

    @HostListener('blur')
    onClose () {
        this.isOpen = false;
    }

    private updatePlaceHolderText (): void {
        this.placeholderText = !this._value ? this._placeholder : '';
    }
}

