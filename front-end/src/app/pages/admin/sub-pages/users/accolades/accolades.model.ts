import { arrayOf, ClassHelper, objectOf, primitive } from 'shared/helpers/class.helper';
import { SlimUser } from 'core/services/auth/auth.model';
import { TimeHelper } from 'shared/helpers/time.helper';

export const ACCOLADE_LABEL_MAP = new Map([
    [1, 'Award'],
    [2, 'Admin'],
    [3, 'Management'],
    [4, 'Moderator'],
    [5, 'Veteran'],
    [6, 'Developer'],
    [7, 'Audio Producer']
]);

export class AccoladeItem {
    @primitive()
    accoladeId: number;
    @primitive()
    role: string;
    @primitive()
    start: number;
    @primitive()
    end: number;
    @primitive()
    type: number;

    constructor (source: Partial<AccoladeItem>) {
        ClassHelper.assign(this, source);
    }

    getStartLabel (): string {
        const date = new Date(this.start * 1000);
        return `${TimeHelper.FULL_MONTHS[date.getMonth()]} ${date.getFullYear()}`;
    }

    getEndLabel (): string {
        if (!this.end) {
            return 'Present';
        }
        const date = new Date(this.end * 1000);
        return `${TimeHelper.FULL_MONTHS[date.getMonth()]} ${date.getFullYear()}`;
    }
}

export class AccoladeType {
    @primitive()
    id: number;
    @primitive()
    icon: string;
    @primitive()
    color: string;

    constructor (source: Partial<AccoladeType>) {
        ClassHelper.assign(this, source);
    }

    get label (): string {
        return ACCOLADE_LABEL_MAP.get(this.id);
    }
}

export class AccoladesPage {
    @objectOf(SlimUser)
    user: SlimUser;
    @arrayOf(AccoladeItem)
    items: Array<AccoladeItem> = [];
    @arrayOf(AccoladeType)
    types: Array<AccoladeType> = [];

    constructor (source: Partial<AccoladesPage>) {
        ClassHelper.assign(this, source);
    }
}

export enum AccoladeActions {
    EDIT,
    DELETE,
    CREATE,
    CANCEL
}
