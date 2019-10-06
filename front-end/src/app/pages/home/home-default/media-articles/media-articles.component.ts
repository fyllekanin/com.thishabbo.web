import { Component, Input } from '@angular/core';
import { SlimArticle } from 'shared/components/slim-article/slim-article.model';

@Component({
    selector: 'app-home-media-articles',
    templateUrl: 'media-articles.component.html',
    styleUrls: [ 'media-articles.component.css' ]
})
export class MediaArticlesComponent {
    private _articles: Array<SlimArticle> = [];

    @Input()
    set articles (articles: Array<SlimArticle>) {
        this._articles = Array.isArray(articles) ? articles : [];
    }

    get articles (): Array<SlimArticle> {
        return this._articles;
    }
}
