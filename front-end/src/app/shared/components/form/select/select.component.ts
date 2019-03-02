import { Component, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { SelectItem } from 'shared/components/form/select/select.model';

@Component({
    selector: 'app-form-select',
    templateUrl: 'select.component.html',
    styleUrls: ['select.component.css']
})
export class SelectComponent {
    private _items: Array<SelectItem> = [];
    private _value: SelectItem = null;

    isOpen = false;
    filter = '';
    @Input() disabled;
    @Input() placeholder = 'Select...';
    @Output() valueChange: EventEmitter<SelectItem> = new EventEmitter();

    constructor(private _elementRef: ElementRef) {}

    @Input()
    set items(items: Array<SelectItem>) {
        this._items = Array.isArray(items) ? items : [];
    }

    @Input()
    set value(item: SelectItem) {
        console.log(item);
        this._value = item;
    }

    get value(): SelectItem {
        return this._value;
    }

    get items(): Array<SelectItem> {
        return this._items.filter(item => item.label.toLowerCase().indexOf(this.filter.toLowerCase()) > -1);
    }

    get textContent(): string {
        return this._items.length > 0 ? (this.value ? this.value.label : this.placeholder) : 'No items...';
    }

    @HostListener('document:click', ['$event'])
    click(event) {
        if (!this._elementRef.nativeElement.contains(event.target) && this.isOpen) {
            this.isOpen = false;
        }
    }

    onFocus() {
        if (!this.disabled && this._items.length > 0) {
            this.isOpen = true;
        }
    }

    onBlur() {
        this.isOpen = false;
    }

    onValueChanged(item: SelectItem) {
        this.value = item;
        this.isOpen = false;
        this.valueChange.emit(this.value);
    }

    @HostListener('blur')
    onClose() {
        this.isOpen = false;
    }
}

