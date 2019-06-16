import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
    selector: '[appMiniProfileHost]',
})

export class MiniProfileDirective {
    constructor (
        public viewContainerRef: ViewContainerRef
    ) { }
}
