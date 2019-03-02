import { arrayOf, ClassHelper, objectOf, primitive } from 'shared/helpers/class.helper';
import { RadioModel } from 'shared/components/radio/radio.model';
import { INFO_BOX_TYPE } from 'shared/app-views/info-box/info-box.model';

export class SlimSiteMessage {
    @primitive()
    siteMessageId: number;
    @primitive()
    title: string;
    @primitive()
    type: number;
    @primitive()
    content: string;

    constructor(source: Partial<SlimSiteMessage>) {
        ClassHelper.assign(this, source);
    }

    getType(): INFO_BOX_TYPE {
        switch (this.type) {
            case 1:
                return INFO_BOX_TYPE.WARNING;
            case 2:
                return INFO_BOX_TYPE.INFO;
            case 3:
            default:
                return INFO_BOX_TYPE.ALERT;
        }
    }
}

export class ContinuesInformationModel {
    @objectOf(RadioModel)
    radio: RadioModel;
    @primitive()
    unreadNotifications: number;
    @arrayOf(SlimSiteMessage)
    siteMessages: Array<SlimSiteMessage> = [];

    constructor(source?: Partial<ContinuesInformationModel>) {
        ClassHelper.assign(this, source);
    }
}
