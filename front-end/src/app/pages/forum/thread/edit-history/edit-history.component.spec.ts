import { EditHistoryComponent } from './edit-history.component';
import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { PostHistoryModel } from '../thread.model';
import { SafeHtmlModule } from 'shared/pipes/safe-html/safe-html.module';
import { User } from 'core/services/auth/auth.model';

describe('EditHistoryComponent', () => {

    let component: EditHistoryComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                SafeHtmlModule
            ],
            declarations: [
                EditHistoryComponent
            ],
            schemas: [ NO_ERRORS_SCHEMA ]
        });
        component = TestBed.createComponent(EditHistoryComponent).componentInstance;
    });

    describe('get edit', () => {
        it('should return undefined if no history is found', () => {
            // Given
            component.setData([]);

            // When
            const result = component.edit;

            // Then
            expect(result).toBeUndefined();
        });
        it('should return the history if historyTimestamp is set', () => {
            // Given
            component.historyTimestamp = 123;
            component.setData([new PostHistoryModel({
                createdAt: 123
            })]);

            // When
            const result = component.edit;

            // Then
            expect(result).not.toBeNull();
            expect(result.createdAt).toEqual(123);
        });
    });

    it('edits should map the history to label and timestamp', () => {
        // Given
        component.setData([
            new PostHistoryModel({
                createdAt: 123,
                user: new User({ nickname: 'Tovven' })
            }),
            new PostHistoryModel({
                createdAt: 456,
                user: new User({ nickname: 'Test' })
            })
        ]);

        // When
        const result = component.edits;

        // Then
        const reg = new RegExp(/[a-zA-Z0-9]+ [a-zA-Z]+ [0-9]+ - [0-9]+:[0-9]+ [A-Z]+ - [a-zA-Z]+/);
        expect(result[0].label.match(reg)).toBeTruthy();
        expect(result[1].label.match(reg)).toBeTruthy();
    });
});
