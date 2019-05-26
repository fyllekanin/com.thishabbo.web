export interface ButtonColor {
    background: string;
    color: string;
    class: string;
}

export class Button {

    static readonly BLUE: ButtonColor = {
        background: '#139bfb',
        color: '#ffffff',
        class: 'blue-button'
    };

    static readonly GREEN: ButtonColor = {
        background: '-webkit-linear-gradient(top,#84c239 0,#4fac13 100%)',
        color: '#ffffff',
        class: 'green-button'
    };

    static readonly YELLOW: ButtonColor = {
        background: '-webkit-linear-gradient(top, rgb(241, 225, 47) 0px, rgb(205, 208, 34) 100%)',
        color: '#ffffff',
        class: 'yellow-button'
    };

    static readonly GRAY: ButtonColor = {
        background: '-webkit-linear-gradient(top, rgb(175, 175, 175) 0px, rgb(152, 152, 152) 100%)',
        color: '#ffffff',
        class: 'gray-button'
    };

    static readonly RED: ButtonColor = {
        background: '-webkit-linear-gradient(top, rgb(228, 120, 120) 0px, rgb(220, 107, 107) 100%)',
        color: '#ffffff',
        class: 'red-button'
    };
}
