export class UserHelper {
    static getNameColor (colors: Array<string>): string {
        let style = `
            font-weight: bold;
            color: ${colors && colors.length > 0 ? colors[0] : '#c1c1c1'};`;

        if (colors && colors.length > 1) {
            let current = 0;
            const stops = 1 / colors.length;
            style += 'background: -webkit-gradient(linear, left top, right top,';

            while (current < 1) {
                style += `color-stop(${current}, ${colors[current / stops]})${current + stops === 1 ? '' : ','}`;
                current += stops;
            }
            style += '); -webkit-background-clip: text; -webkit-text-fill-color: transparent;';
        }

        return style;
    }

    static getBarColor (colors: Array<string>): string {
        let style = `
            font-weight: bold;
            color: #ffffff;
            background: url(/assets/images/bargradient.png), ${colors && colors.length > 0 ? colors[0] : '#c1c1c1'};`;
        
        if (colors && colors.length > 1) {
            let current = 0;
            const stops = 1 / colors.length;
            style += 'background: url(/assets/images/bargradient.png), -webkit-gradient(linear, left top, right top,';

            while (current < 1) {
                style += `color-stop(${current}, ${colors[current / stops]})${current + stops === 1 ? '' : ','}`;
                current += stops;
            }
            style += ');';
        }

        return style;
    }

    static getYoutubeLink (id: string): string {
        return `https://www.youtube.com/watch?v=${id}`;
    }
}
