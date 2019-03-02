import { ClassHelper, primitive } from 'shared/helpers/class.helper';

export class StaffOfTheWeekModel {
    @primitive()
    startDay: number;
    @primitive()
    endDay: number;
    @primitive()
    month: string;
    @primitive()
    globalManagement: string;
    @primitive()
    europeManagement: string;
    @primitive()
    northAmericanManagement: string;
    @primitive()
    oceaniaManagement: string;
    @primitive()
    europeRadio: string;
    @primitive()
    northAmericanRadio: string;
    @primitive()
    oceaniaRadio: string;
    @primitive()
    europeEvents: string;
    @primitive()
    northAmericanEvents: string;
    @primitive()
    oceaniaEvents: string;
    @primitive()
    moderation: string;
    @primitive()
    media: string;
    @primitive()
    quests: string;
    @primitive()
    graphics: string;
    @primitive()
    audioProducer: string;

    constructor(source?) {
        ClassHelper.assign(this, source);
    }
}
