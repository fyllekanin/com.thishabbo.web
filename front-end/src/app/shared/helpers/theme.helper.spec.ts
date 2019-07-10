import { ThemeHelper } from 'shared/helpers/theme.helper';

describe('ThemeHelper', () => {

    describe('ApplyTheme', () => {
        afterEach(() => {
            document.getElementById(ThemeHelper.THEME_STYLE_ID).remove();
        });
        it('should create and append style element if none existent', () => {
            // Given
            const ele = document.getElementById(ThemeHelper.THEME_STYLE_ID);
            if (ele) {
                ele.remove();
            }
            expect(document.getElementById(ThemeHelper.THEME_STYLE_ID)).toBeNull();
            const theme = '.test { color: #000000; }';

            // When
            ThemeHelper.applyTheme(theme);

            // Then
            expect(document.getElementById(ThemeHelper.THEME_STYLE_ID)).not.toBeNull();
        });
        it('should reuse the same style element if existent', () => {
            // Given
            const theme = '.test { color: #000000; }';
            ThemeHelper.applyTheme('');
            expect(document.getElementById(ThemeHelper.THEME_STYLE_ID).innerText).toBe('');

            // When
            ThemeHelper.applyTheme(theme);

            // Then
            expect(document.getElementById(ThemeHelper.THEME_STYLE_ID).innerText).toBe(theme);
        });
    });
});
