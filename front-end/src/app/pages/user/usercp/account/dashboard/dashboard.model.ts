import { primitive, ClassHelper } from 'shared/helpers/class.helper';

export class UserCpDashboardModel {
    @primitive()
    userId: number;
    @primitive()
    registerTimestamp: number;
    @primitive()
    itemsOwned: number;
    @primitive()
    likes: number;

    constructor (source?: Partial<UserCpDashboardModel>) {
        ClassHelper.assign(this, source);
    }
}
