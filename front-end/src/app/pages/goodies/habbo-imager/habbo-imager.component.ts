import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { habboDirections, habboEmotions, habboItems, habboSizes } from './habbo-imager.model';
import { StringHelper } from 'shared/helpers/string.helper';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { TitleTopBorder } from "shared/app-views/title/title.model";

@Component({
    selector: 'app-goodies-habbo-imager',
    templateUrl: 'habbo-imager.component.html',
    styleUrls: ['habbo-imager.component.css']
})
export class HabboImagerComponent extends Page implements OnDestroy {
    topBorderRed = TitleTopBorder.RED;

    private _basicUrl = 'https://www.habbo.com/habbo-imaging/avatarimage?user={habbo}';

    private _queryArray = [
        'gesture',
        'direction',
        'head_direction',
        'size',
        'action'
    ];

    // Results
    directLink = 'nothing now';
    bbcode = 'nothing now';
    html = 'nothing now';

    url: string;
    habbo = 'bear94';
    expression = habboEmotions.NORMAL;
    bodyDirection = habboDirections['2'];
    headDirection = habboDirections['2'];
    size = habboSizes.NORMAL;
    item = habboItems.NONE;
    actions = {
        walking: {
            value: false,
            query: 'wlk'
        },
        lying_down: {
            value: false,
            query: 'lay'
        },
        sitting: {
            value: false,
            query: 'sit'
        },
        waving: {
            value: false,
            query: 'wav'
        },
        holding: {
            value: false,
            query: 'crr'
        },
        drinking: {
            value: false,
            query: 'drk'
        },
    };

    constructor(
        elementRef: ElementRef,
        breadcrumbService: BreadcrumbService
    ) {
        super(elementRef);
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: 'Habbo Imager'
        });
        this.urlBuilder();
    }

    ngOnDestroy(): void {
        super.destroy();
    }

    /**
     * Build complete URL with expression etc, called on change
     */
    urlBuilder(): void {
        this.url = this._basicUrl
            .replace('{habbo}', this.habbo);

        this.url = this._queryArray.reduce((prev, curr) => {
            let value = null;
            switch (curr) {
                case 'gesture':
                    value = this.expression || null;
                    break;
                case 'direction':
                    value = this.bodyDirection || null;
                    break;
                case 'head_direction':
                    value = this.headDirection || null;
                    break;
                case 'size':
                    if (this.size === habboSizes.HEAD_ONLY) {
                        return prev + '&headonly=1';
                    }
                    value = this.size;
                    break;
                case 'action':
                    value = Object.keys(this.actions).map(key => this.actions[key])
                        .filter(item => item.value)
                        .map(item => item.query)
                        .join(',');
                    if (this.item && this.item !== 'null') {
                        value += `=${this.item}`;
                    }
                    break;
            }

            return prev + (value ? `&${curr}=${value}` : '');
        }, this.url);

        this.directLink = this.url;
        this.bbcode = `[IMG]${this.url}[/IMG]`;
        this.html = `<img src="${this.url}" />`;
    }

    updateBodyDirection(direction: string): void {
        this.bodyDirection = direction;
        this.urlBuilder();
    }

    updateHeadDirection(direction: string): void {
        this.headDirection = direction;
        this.urlBuilder();
    }

    get items(): Array<{ label: string, value: string }> {
        return Object.keys(habboItems).map(key => {
            return {
                label: StringHelper.prettifyString(key),
                value: habboItems[key]
            };
        });
    }

    get sizes(): Array<{ label: string, value: string }> {
        return Object.keys(habboSizes).map(key => {
            return {
                label: StringHelper.prettifyString(key),
                value: habboSizes[key]
            };
        });
    }

    get bodyDirections(): Array<{ src: string, value: string }> {
        return Object.keys(habboDirections).map(key => {
            return {
                src: this._basicUrl.replace('{habbo}', this.habbo) + `&direction=${habboDirections[key]}`,
                value: habboDirections[key]
            };
        });
    }

    get headDirections(): Array<{ src: string, value: string }> {
        return Object.keys(habboDirections).map(key => {
            return {
                src: this._basicUrl.replace('{habbo}', this.habbo) +
                    `&headonly=1&head_direction=${habboDirections[key]}`,
                value: habboDirections[key]
            };
        });
    }

    get emotions(): Array<{ label: string, value: string }> {
        return Object.keys(habboEmotions).map(key => {
            return {
                label: StringHelper.firstCharUpperCase(key),
                value: habboEmotions[key]
            };
        });
    }
}
