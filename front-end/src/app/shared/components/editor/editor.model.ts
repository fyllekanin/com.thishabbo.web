import { ClassHelper } from 'shared/helpers/class.helper';
import { primitive } from 'shared/helpers/class.helper';
import { ButtonColor } from 'shared/directives/button/button.model';

export class EditorAction {
    @primitive()
    title: string;
    @primitive()
    value?: number;
    @primitive()
    asButton?: boolean;
    buttonColor?: ButtonColor;
    saveCallback?: () => {};

    constructor(source: Partial<EditorAction>) {
        ClassHelper.assign(this, source);
    }
}
