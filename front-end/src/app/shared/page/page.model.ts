import { TimeHelper } from 'shared/helpers/time.helper';
import { ElementRef, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

export abstract class Page implements OnDestroy {
    private _subscriptions: Array<Subscription> = [];

    constructor(elementRef: ElementRef) {
        elementRef.nativeElement.style.display = 'block';
        elementRef.nativeElement.style.width = '100%';
        elementRef.nativeElement.style.fontSize = '0.7rem';
    }

    timeAgo(time: number): string {
        return TimeHelper.getTime(time);
    }

    longDay(time: number): string {
        return TimeHelper.getLongDate(time);
    }

    addSubscription(method: { subscribe: (callback: () => void) => Subscription }, callback: () => void): void {
        this._subscriptions.push(method.subscribe(callback));
    }

    abstract ngOnDestroy();

    destroy(): void {
        this._subscriptions.forEach(sub => {
            sub.unsubscribe();
        });
    }
}
