import { arrayOf, ClassHelper, primitive } from 'shared/helpers/class.helper';


export class PermShow {
    private _hour: number;
    private _day: number;

    @primitive()
    timetableId: number;
    @primitive()
    type: number;
    @primitive()
    name: string;
    @primitive()
    nickname: string;
    @primitive()
    description: string;
    @primitive()
    link: string;
    @primitive()
    createdAt: number;

    set hour (num: number) {
        this._hour = Number(num);
    }

    get hour (): number {
        return this._hour;
    }

    set day (num: number) {
        this._day = Number(num);
    }

    get day (): number {
        return this._day;
    }

    get isEvents (): boolean {
        return Number(this.type) === 1;
    }

    constructor (source?: Partial<PermShow>) {
        ClassHelper.assign(this, source);
    }
}

export class PermShowsListPage {
    @arrayOf(PermShow)
    permShows: Array<PermShow> = [];
    @primitive()
    total: number;
    @primitive()
    page: number;

    constructor (source?: Partial<PermShowsListPage>) {
        ClassHelper.assign(this, source);
    }
}

export enum PermShowActions {
    EDIT_PERM_SHOW,
    DELETE_PERM_SHOW,
    CANCEL,
    DELETE,
    SAVE
}


