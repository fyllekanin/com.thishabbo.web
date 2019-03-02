import { arrayOf, ClassHelper, primitive } from 'shared/helpers/class.helper';
import { ForumLatestPost } from '../forum.model';

export class LatestPostsPage {
    @primitive()
    page: number;
    @primitive()
    total: number;
    @arrayOf(ForumLatestPost)
    items: Array<ForumLatestPost> = [];

    constructor(source: Partial<LatestPostsPage>) {
        ClassHelper.assign(this, source);
    }
}
