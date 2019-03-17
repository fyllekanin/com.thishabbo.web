
export class ThemeHelper {
    private static readonly THEME_STYLE_ID = 'custom-theme-style-element';

    static applyTheme(theme: string): void {
        let element;

        if (this.isElementAdded()) {
            element = document.getElementById(ThemeHelper.THEME_STYLE_ID);
        } else {
            element = this.createStyleElement();
        }

        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }

        element.appendChild(document.createTextNode(theme));
    }

    private static isElementAdded(): boolean {
        return Boolean(document.getElementById(ThemeHelper.THEME_STYLE_ID));
    }

    private static createStyleElement(): HTMLStyleElement {
        const css = document.createElement('style');
        css.id = 'theme';
        css.type = 'text/css';

        document.head.appendChild(css);
        return css;
    }
}
