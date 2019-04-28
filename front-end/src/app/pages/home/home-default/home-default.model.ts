import { Notice } from 'shared/components/notice/notice.model';
import { arrayOf, ClassHelper } from 'shared/helpers/class.helper';
import { SlimArticle } from 'shared/components/slim-article/slim-article.model';

export class HomeDefaultPage {
    @arrayOf(SlimArticle)
    articles: Array<SlimArticle> = [];
    @arrayOf(SlimArticle)
    mediaArticles: Array<SlimArticle> = [];
    @arrayOf(Notice)
    notices: Array<Notice> = [];

    constructor (source?: Partial<HomeDefaultPage>) {
        ClassHelper.assign(this, source);
    }
}
