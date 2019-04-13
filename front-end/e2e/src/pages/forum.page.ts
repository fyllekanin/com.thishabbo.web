import { browser, by, element, ElementFinder, ExpectedConditions } from 'protractor';

export class ForumPage {

    static verifyLatestPost(value: string, index: number): void {
        const ele = element.all((by.css('.latest-post-row .data .title'))).get(0);
        browser.wait(ExpectedConditions.presenceOf(ele), 10000, `Expected latest post at index ${index} to be ${value}`);
    }

    static getCategoryElement(value: string): ElementFinder {
        const ele = element(by.cssContainingText('app-forum-slim-category .title', value));
        browser.wait(ExpectedConditions.presenceOf(ele), 10000, `Expected category "${value}" to be present`);

        return ele;
    }

    static getThreadElement(value: string): ElementFinder {
        return element(by.cssContainingText('app-forum-slim-thread .title', value));
    }

    static getClosedElement(index: number): ElementFinder {
        return element.all(by.css('app-forum-slim-thread .closed')).get(index);
    }

    static getStickyElement(index: number): ElementFinder {
        return element.all(by.css('app-forum-slim-thread .sticky')).get(index);
    }

    static getFixedToolsElement(name: string): ElementFinder {
        return element(by.cssContainingText('app-fixed-tools button', name));
    }
}
