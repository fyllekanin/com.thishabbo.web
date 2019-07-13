
export class ThemeHelper {
    static readonly THEME_STYLE_ID = 'custom-theme-style-element';

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

    static isMobile (): boolean {
        return window.innerWidth < 600;
    }

    private static isElementAdded(): boolean {
        return Boolean(document.getElementById(ThemeHelper.THEME_STYLE_ID));
    }

    private static createStyleElement(): HTMLStyleElement {
        const css = document.createElement('style');
        css.id = ThemeHelper.THEME_STYLE_ID;

        document.head.appendChild(css);
        return css;
    }
}
