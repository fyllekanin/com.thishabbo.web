export class UserHelper {
    static getNameColor (colors: Array<string>): string {
        if (!colors || colors.length === 0) {
            return 'color: #999999';
        }
        let style = `font-weight: bold;\
            color: ${colors && colors.length > 0 ? colors[0] : '#999999'} !important;`;

        if (colors && colors.length > 1) {
            const stops = (Math.floor(100 / colors.length) / 100);
            style += colors.reduce((prev, curr, index) => {
                return prev + `color-stop(${stops * (index + 1)}, ${curr})${(index + 1) === colors.length ? '' : ','}`;
            }, 'background: -webkit-gradient(linear, left top, right top,');
            style += '); -webkit-background-clip: text; -webkit-text-fill-color: transparent;';
        }

        return style;
    }

    static getBarColor (colors: Array<string>): string {
        let style = `font-weight: bold;\
            color: #ffffff;\
            background: url(/assets/images/bargradient.png), ${colors && colors.length > 0 ? colors[0] : '#c1c1c1'};`;

        if (colors && colors.length > 1) {
            const stops = (Math.floor(100 / colors.length) / 100);
            style += colors.reduce((prev, curr, index) => {
                return prev + `color-stop(${stops * (index + 1)}, ${curr})${(index + 1) === colors.length ? '' : ','}`;
            }, 'background: url(/assets/images/bargradient.png), -webkit-gradient(linear, left top, right top,');
            style += '); -webkit-background-clip: text; -webkit-text-fill-color: transparent;);';
        }

        return style;
    }

    static getYoutubeLink (id: string): string {
        return `https://www.youtube.com/embed/${id}`;
    }
}
