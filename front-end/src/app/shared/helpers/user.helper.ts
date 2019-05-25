export class UserHelper {
    static getNameColour(colours: Array<string>): string {
        let style = `
            font-size: 0.9rem;
            font-weight: bold;
            color: ${colours.length > 0 ? colours[0] : '#000000'};`;


        if (colours.length > 1) {
            let current = 0;
            const stops = 1 / colours.length;
            style += 'background: -webkit-gradient(linear, left top, right top,';

            while (current < 1) {
                style += `color-stop(${current}, ${colours[current / stops]})${current + stops === 1 ? '' : ','}`;
                current += stops;
            }
            style += '); -webkit-background-clip: text; -webkit-text-fill-color: transparent;';
        }

        return style;
    }
}
