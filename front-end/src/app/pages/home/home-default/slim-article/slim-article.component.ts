import { StringHelper } from 'shared/helpers/string.helper';
import { TimeHelper } from 'shared/helpers/time.helper';
import { Component, Input } from '@angular/core';
import { SlimArticle } from '../home-default.model';

@Component({
    selector: 'app-slim-article',
    templateUrl: 'slim-article.component.html',
    styleUrls: ['slim-article.component.css']
})
export class SlimArticleComponent {
    private _article: SlimArticle = new SlimArticle();

    prettify(str: string): string {
        return StringHelper.firstCharUpperCase(str);
    }

    @Input()
    set article(article: SlimArticle) {
        this._article = article || new SlimArticle();
    }

    get threadLink(): string {
        return `/forum/thread/${this._article.threadId}/page/1`;
    }

    get haveBadge(): boolean {
        return Boolean(this._article.badge);
    }

    get backgroundImage(): string {
        return `url(/rest/resources/images/thumbnails/${this._article.threadId}.gif)`;
    }

    get badgeUrl(): string {
        return `https://habboo-a.akamaihd.net/c_images/album1584/${this._article.badge}.gif`;
    }

    get article(): SlimArticle {
        return this._article;
    }

    get time(): string {
        return TimeHelper.getTime(this._article.createdAt);
    }
}
