import { Component, Input } from '@angular/core';
import { SlimArticle } from '../home-default.model';
import { TimeHelper } from 'shared/helpers/time.helper';

@Component({
    selector: 'app-home-media-articles',
    templateUrl: 'media-articles.component.html',
    styleUrls: ['media-articles.component.css']
})
export class MediaArticlesComponent {
    private _articles: Array<SlimArticle> = [];

    getBackgroundImage(articleId: number): string {
        return `url(/rest/resources/images/thumbnails/${articleId}.gif)`;
    }

    getTime(article: SlimArticle) {
        return TimeHelper.getTime(article.createdAt);
    }

    @Input()
    set articles(articles: Array<SlimArticle>) {
        this._articles = Array.isArray(articles) ? articles : [];
    }

    get articles(): Array<SlimArticle> {
        return this._articles;
    }
}
