export interface ButtonColor {
    background: string;
    color: string;
}

export class Button {

    static readonly BLUE: ButtonColor = {
        background: '#139bfb',
        color: '#ffffff'
    };

    static readonly GREEN: ButtonColor = {
        background: '-webkit-linear-gradient(top,#84c239 0,#4fac13 100%)',
        color: '#ffffff'
    };

    static readonly YELLOW: ButtonColor = {
        background: '-webkit-linear-gradient(top, rgb(241, 225, 47) 0px, rgb(205, 208, 34) 100%)',
        color: '#ffffff'
    };

    static readonly GRAY: ButtonColor = {
        background: '-webkit-linear-gradient(top, rgb(175, 175, 175) 0px, rgb(152, 152, 152) 100%)',
        color: '#ffffff'
    };
}
