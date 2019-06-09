import { ClassHelper, objectOf, primitive } from 'shared/helpers/class.helper';

export class DashboardStats {
    @primitive()
    posts: number;
    @primitive()
    threads: number;
    @primitive()
    credits: number;
    @primitive()
    subscriptions: number;

    constructor (source: Partial<DashboardStats>) {
        ClassHelper.assign(this, source);
    }
}

export class DashboardModel {
    @objectOf(DashboardStats)
    stats: DashboardStats;

    constructor (source: Partial<DashboardModel>) {
        ClassHelper.assign(this, source);
    }
}
