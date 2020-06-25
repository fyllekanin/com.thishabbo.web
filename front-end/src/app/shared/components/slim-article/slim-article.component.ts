import { StringHelper } from 'shared/helpers/string.helper';
import { Component, Input } from '@angular/core';
import { SlimArticle } from 'shared/components/slim-article/slim-article.model';

@Component({
    selector: 'app-slim-article',
    templateUrl: 'slim-article.component.html',
    styleUrls: [ 'slim-article.component.css' ]
})
export class SlimArticleComponent {
    private _article: SlimArticle = new SlimArticle();

    prettify (str: string): string {
        return StringHelper.firstCharUpperCase(str);
    }

    @Input()
    set article (article: SlimArticle) {
        this._article = article || new SlimArticle();
    }

    get threadLink (): string {
        return `/forum/thread/${this._article.threadId}/page/1`;
    }

    get haveBadge (): boolean {
        return Boolean(this._article.badges && this._article.badges.length > 0);
    }

    get badgeCount (): number {
        return this._article.badges.length;
    }

    get backgroundImage (): string {
        return `url(/resources/images/thumbnails/${this._article.threadId}.gif?updatedAt=${this._article.updatedAt})`;
    }

    get badge (): string {
        return this._article.badges[0];
    }

    get article (): SlimArticle {
        return this._article;
    }
}
