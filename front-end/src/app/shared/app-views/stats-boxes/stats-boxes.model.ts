import { TitleTopBorder } from 'shared/app-views/title/title.model';
import { ClassHelper } from 'shared/helpers/class.helper';

export class StatsBoxModel {
    borderColor: TitleTopBorder;
    icon: string;
    externalIcon: string;
    externalIconStyle: string;
    externalIconLink: string;
    title: string;
    breadText: string;
    innerHTML: string;

    constructor (source: Partial<StatsBoxModel>) {
        ClassHelper.assign(this, source);
    }
}
