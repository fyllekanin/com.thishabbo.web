import { arrayOf, ClassHelper, primitive } from 'shared/helpers/class.helper';

export class PostStatisticsModel {
    @primitive()
    day: number;
    @primitive()
    month: number;
    @primitive()
    posts: number;

    constructor (source: Partial<PostStatisticsModel>) {
        ClassHelper.assign(this, source);
    }
}

export class PostsStatisticsModel {
    @arrayOf(PostStatisticsModel)
    statistics: Array<PostStatisticsModel> = [];
    @primitive()
    earliestYear: number;
    @primitive()
    latestYear: number;
    @primitive()
    year: number;
    @primitive()
    month: number;

    constructor (source: Partial<PostsStatisticsModel>) {
        ClassHelper.assign(this, source);
    }
}
