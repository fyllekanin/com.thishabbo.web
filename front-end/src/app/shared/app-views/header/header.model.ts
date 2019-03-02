import { ClassHelper, objectOf, primitive } from 'shared/helpers/class.helper';
import { RadioModel } from 'shared/components/radio/radio.model';

export class HeaderModel {
    @objectOf(RadioModel)
    radio: RadioModel;
    @primitive()
    unreadNotifications: number;

    constructor(source?: Partial<HeaderModel>) {
        ClassHelper.assign(this, source);
    }
}
