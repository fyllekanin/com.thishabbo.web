import { UserHelper } from 'shared/helpers/user.helper';

describe('UserHelper', () => {

    it('getYoutubeLink should append ID on embedded youtube link', () => {
        // Given
        const id = 'something';

        // When
        const url = UserHelper.getYoutubeLink(id);

        // Then
        expect(url).toEqual(`https://www.youtube.com/embed/${id}`);
    });

    describe('getBarColor', () => {
        it('should set default color if argument is not set', () => {
            // Given
            const colors = null;

            // When
            const style = UserHelper.getBarColor(colors);

            // Then
            expect(style).toContain('#c1c1c1');
            expect(style).not.toContain('color-stop');
        });

        it('should set first color if only one color', () => {
            // Given
            const colors = ['#ffffff'];

            // When
            const style = UserHelper.getBarColor(colors);

            // Then
            expect(style).toContain('#ffffff');
            expect(style).not.toContain('color-stop');
        });

        it('should set color stops if multiple colors', () => {
            // Given
            const colors = ['#ffffff', '#000000'];

            // When
            const style = UserHelper.getBarColor(colors);

            // Then
            expect(style).toContain('#ffffff');
            expect(style).toContain('#000000');
            expect(style).toContain('color-stop');
        });
    });

    describe('getNameColor', () => {
        it('should set default color if argument is not set', () => {
            // Given
            const colors = null;

            // When
            const style = UserHelper.getBarColor(colors);

            // Then
            expect(style).toContain('#c1c1c1');
            expect(style).not.toContain('color-stop');
        });

        it('should set first color if only one color', () => {
            // Given
            const colors = ['#ffffff'];

            // When
            const style = UserHelper.getBarColor(colors);

            // Then
            expect(style).toContain('#ffffff');
            expect(style).not.toContain('color-stop');
        });

        it('should set color stops if multiple colors', () => {
            // Given
            const colors = ['#ffffff', '#000000'];

            // When
            const style = UserHelper.getBarColor(colors);

            // Then
            expect(style).toContain('#ffffff');
            expect(style).toContain('#000000');
            expect(style).toContain('color-stop');
        });
    });
});
