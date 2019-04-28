import { arrayOf, ClassHelper, primitive } from 'shared/helpers/class.helper';
import { SlimArticle } from 'shared/components/slim-article/slim-article.model';

export class BadgeArticlesPage {
    @primitive()
    total: number;
    @primitive()
    page: number;
    @arrayOf(SlimArticle)
    items: Array<SlimArticle> = [];

    constructor (source: Partial<BadgeArticlesPage>) {
        ClassHelper.assign(this, source);
    }
}
