import { StringHelper } from 'shared/helpers/string.helper';

describe('StringHelper', () => {

    describe('firstCharUpperCase', () => {
        it('should return empty string if value is null', () => {
            // Given
            const value = null;

            // When
            const result = StringHelper.firstCharUpperCase(value);

            // Then
            expect(result).toBe('');
        });
        it('should make first character uppercase and the rest lowercase', () => {
            // Given
            const value = 'aWesOme';

            // When
            const result = StringHelper.firstCharUpperCase(value);

            // Then
            expect(result).toBe('Awesome');
        });
    });
});
