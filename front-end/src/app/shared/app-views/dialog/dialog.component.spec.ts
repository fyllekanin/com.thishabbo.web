import { DialogService } from 'core/services/dialog/dialog.service';
import { TestBed } from '@angular/core/testing';
import { DialogButton, DialogCloseButton, DialogConfig } from 'shared/app-views/dialog/dialog.model';
import { Subject } from 'rxjs';
import { DialogComponent } from 'shared/app-views/dialog/dialog.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('DialogComponent', () => {

    class DialogServiceMock {
        private _onConfig: Subject<any> = new Subject();
        private _onClose: Subject<any> = new Subject();

        close () {
            this._onClose.next();
        }

        open (config: DialogConfig) {
            this._onConfig.next(config);
        }

        get onDialogClose () {
            return this._onClose.asObservable();
        }

        get onDialogConfig () {
            return this._onConfig.asObservable();
        }
    }

    let component: DialogComponent;
    let service: DialogServiceMock;

    beforeEach(() => {
        service = new DialogServiceMock();

        TestBed.configureTestingModule({
            imports: [],
            declarations: [
                DialogComponent
            ],
            providers: [
                {provide: DialogService, useValue: service}
            ],
            schemas: [NO_ERRORS_SCHEMA]
        });

        component = TestBed.createComponent(DialogComponent).componentInstance;
    });

    it('onButton should call the callback on the button', () => {
        // Given
        const button = new DialogButton({
            title: 'something',
            callback: () => {
            }
        });
        spyOn(button, 'callback');

        // When
        component.onButton(button);

        // Then
        expect(button.callback).toHaveBeenCalled();
    });

    describe('title', () => {
        it('should return title from config', () => {
            // Given
            service.open({title: 'test', content: 'no', buttons: []});
            // When
            const result = component.title;

            // Then
            expect(result).toBe('test');
        });
        it('should return empty string if config is not set', () => {
            // When
            const result = component.title;

            // Then
            expect(result).toBe('');
        });
    });

    describe('content', () => {
        it('should return content from config', () => {
            // Given
            service.open({title: 'test', content: 'no', buttons: []});
            // When
            const result = component.content;

            // Then
            expect(result).toBe('no');
        });
        it('should return empty string if config is not set', () => {
            // When
            const result = component.content;

            // Then
            expect(result).toBe('');
        });
    });

    describe('buttons', () => {
        it('should return buttons from config', () => {
            // Given
            service.open({
                title: 'test', content: 'no', buttons: [
                    new DialogButton({title: 'test'})
                ]
            });
            // When
            const result = component.buttons;

            // Then
            expect(result.length).toBe(1);
        });
        it('should return empty array if config is not set', () => {
            // When
            const result = component.buttons;

            // Then
            expect(result.length).toBe(0);
        });
        it('should sort them to put DialogCloseButton to the left always', () => {
            // Given
            service.open({
                title: 'test', content: '', buttons: [
                    new DialogCloseButton('Close'),
                    new DialogButton({title: 'test'})
                ]
            });

            // When
            const result = component.buttons;

            // Then
            expect(result[1] instanceof DialogCloseButton).toBeTruthy();
        });
    });
});
