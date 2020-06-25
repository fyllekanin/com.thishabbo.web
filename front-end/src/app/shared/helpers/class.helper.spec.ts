import { isAbsent, isPresent } from 'shared/helpers/class.helper';

describe('Class Helper', () => {

    describe('isAbsent', () => {
        it('should return true if value is null', () => {
            // Given
            const value = null;

            // When
            const result = isAbsent(value);

            // Then
            expect(result).toBeTruthy();
        });
        it('should return true if value is undefined', () => {
            // Given
            const value = undefined;

            // When
            const result = isAbsent(value);

            // Then
            expect(result).toBeTruthy();
        });
        it('should return false if value is not null or undefined', () => {
            // Given
            const value = 'test';

            // When
            const result = isAbsent(value);

            // Then
            expect(result).toBeFalsy();
        });
    });

    describe('isPresent', () => {
        it('should return false if value is null', () => {
            // Given
            const value = null;

            // When
            const result = isPresent(value);

            // Then
            expect(result).toBeFalsy();
        });
        it('should return false if value is undefined', () => {
            // Given
            const value = undefined;

            // When
            const result = isPresent(value);

            // Then
            expect(result).toBeFalsy();
        });
        it('should return true if value is not null or undefined', () => {
            // Given
            const value = 'test';

            // When
            const result = isPresent(value);

            // Then
            expect(result).toBeTruthy();
        });
    });
});
