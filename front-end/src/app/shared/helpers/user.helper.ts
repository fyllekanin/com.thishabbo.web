export interface UserStyle {
    'font-weight': string;
    color?: string;
    background: string;
    '-webkit-text-fill-color'?: string;
}

export class UserHelper {
    static getNameColor (colors: Array<string>): UserStyle {
        if (!colors || colors.length === 0) {
            return {
                'font-weight': 'normal',
                color: '#999999',
                background: ''
            };
        }
        const percentage = Math.round(100 / colors.length);
        const stops = colors.map((color, index) => `${color} ${percentage * (index + 1)}%`);
        const singleColor = `${colors[0]},${colors[0]}`;
        const background = `-webkit-linear-gradient(top left, ${colors.length > 1 ? stops.join(',') : singleColor})`;
        return {
            'font-weight': 'bold',
            background: background,
            '-webkit-text-fill-color': 'transparent'
        };
    }

    static getBarColor (colors: Array<string>): UserStyle {
        let background = `url(/assets/images/bargradient.png), ${colors && colors.length > 0 ? colors[0] : '#c1c1c1'}`;

        if (colors && colors.length > 1) {
            const percentage = Math.round(100 / colors.length);
            const stops = colors.map((color, index) => `${color} ${percentage * (index + 1)}%`);
            background = `url(/assets/images/bargradient.png), -webkit-linear-gradient(top left, ${stops.join(',')})`;
        }

        return {
            'font-weight': 'bold',
            color: '#ffffff',
            background: background
        };
    }

    static getYoutubeLink (id: string): string {
        return `https://www.youtube.com/embed/${id}`;
    }
}
