import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
    selector: '[miniProfileHost]',
})

export class MiniProfileDirective {
    constructor (
        public viewContainerRef: ViewContainerRef
    ) { }
}