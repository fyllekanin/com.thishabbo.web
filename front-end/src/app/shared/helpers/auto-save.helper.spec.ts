import { AutoSaveHelper } from 'shared/helpers/auto-save.helper';
import { AutoSave } from '../../pages/forum/forum.model';
import { fakeAsync, tick } from '@angular/core/testing';

describe('AutoSaveHelper', () => {

    describe('exists', () => {
        it('should return true if the type and contentId exists in localStorage', fakeAsync(() => {
            // Given
            AutoSaveHelper.save({ type: AutoSave.THREAD, contentId: 1, content: '' });
            tick(201);

            // When
            const result = AutoSaveHelper.exists(AutoSave.THREAD, 1);

            // Then
            expect(result).toBeTruthy();
        }));
        it('should return false if type and contentId do not exist in localStorage', () => {
            // Given
            AutoSaveHelper.remove(AutoSave.THREAD, 1);

            // When
            const result = AutoSaveHelper.exists(AutoSave.THREAD, 1);

            // Then
            expect(result).toBeFalsy();
        });
    });

    it('save should save the content to localStorage', fakeAsync(() => {
        // Given
        AutoSaveHelper.save({ type: AutoSave.THREAD, contentId: 1, content: 'test' });
        tick(201);

        // When
        const result = AutoSaveHelper.get(AutoSave.THREAD, 1);

        // Then
        expect(result.content).toBe('test');
    }));

    describe('get', () => {
        it('should return null if value do not exist', () => {
            // When
            const result = AutoSaveHelper.get(AutoSave.THREAD, 2);

            // Then
            expect(result).toBeNull();
        });
        it('should return the value if it exists', fakeAsync(() => {
            // Given
            AutoSaveHelper.save({ type: AutoSave.THREAD, contentId: 3, content: 'test' });
            tick(201);

            // When
            const result = AutoSaveHelper.get(AutoSave.THREAD, 3);

            // Then
            expect(result.content).toBe('test');
        }));
    });

    it('remove should delete the item from localStorage', fakeAsync(() => {
        // Given
        AutoSaveHelper.save({ type: AutoSave.THREAD, contentId: 1, content: 'test' });
        tick(201);

        let result = AutoSaveHelper.get(AutoSave.THREAD, 1);
        expect(result).not.toBeNull();

        // When
        AutoSaveHelper.remove(AutoSave.THREAD, 1);

        // Then
        result = AutoSaveHelper.get(AutoSave.THREAD, 1);
        expect(result).toBeNull();
    }));
});
