import { TitleTopBorder } from 'shared/app-views/title/title.model';
import { ClassHelper } from 'shared/helpers/class.helper';

export class StatsBoxModel {
    borderColor: TitleTopBorder;
    icon: string;
    externalIcons: Array<string> = [];
    badges: Array<string> = [];
    externalIconStyle: string;
    externalIconLink: string;
    title: string;
    breadText: string;
    innerHTML: string;
    innerHTMLCallback: () => void;

    constructor (source: Partial<StatsBoxModel>) {
        ClassHelper.assign(this, source);
    }
}
