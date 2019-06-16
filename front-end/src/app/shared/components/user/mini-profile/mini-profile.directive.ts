import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
    selector: '[mini-profile-host]',
})

export class MiniProfileDirective {
    constructor (
        public viewContainerRef: ViewContainerRef
    ) { }
}