import { TimeHelper } from 'shared/helpers/time.helper';
import { Page } from 'shared/page/page.model';
import { ElementRef, OnDestroy } from '@angular/core';
import { Subject, Subscription } from 'rxjs';

describe('Page Model', () => {

    class Test extends Page implements OnDestroy {
        ngOnDestroy (): void {
            super.destroy();
        }
    }

    let native;
    let page: Test;

    beforeEach(() => {
        native = {
            style: <any>{}
        };
        const eleRef = new ElementRef(native);
        page = new Test(eleRef);
    });

    it('constructor should set display, width and fontSize on element', () => {
        // Then
        expect(page).toBeDefined();
        expect(native.style.display).toBeDefined();
        expect(native.style.width).toBeDefined();
        expect(native.style.fontSize).toBeDefined();
    });

    it('timeAgo should call on TimeHelper.getTime', () => {
        // Given
        spyOn(TimeHelper, 'getTime');

        // When
        page.timeAgo(123);

        // Then
        expect(TimeHelper.getTime).toHaveBeenCalled();
    });

    it('addSubscription should add subscription and call the callback on data', (done) => {
        // Given
        const callback = () => done();
        const subject = new Subject();

        // When
        page.addSubscription(subject.asObservable(), callback);

        // Then
        subject.next(null);
    });

    it('destroy should unsubscribe the subscription', (done) => {
        // Given
        const subscription = <Subscription>{ unsubscribe: () => done() };
        const ob = {
            subscribe: (_callback: () => void): Subscription => subscription
        };

        // When
        page.addSubscription(ob, () => null);

        // Then
        page.destroy();
    });
});
