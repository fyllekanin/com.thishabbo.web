import { browser, by, element, ElementFinder, ExpectedConditions } from 'protractor';

export class NewThreadPage {

    static getThreadTitleElement (): ElementFinder {
        const ele = element(by.css('app-forum-thread-controller input[name="thread-title"]'));
        browser.wait(ExpectedConditions.presenceOf(ele), 10000, 'Expected new thread title input to be present');

        return ele;
    }

    static getThumbnailElement (): ElementFinder {
        const ele = element(by.css('app-forum-thread-controller input[name="thread-thumbnail"]'));
        browser.wait(ExpectedConditions.presenceOf(ele), 10000, 'Expected new thread thumbnail input to be present');

        return ele;
    }

    static getBadgeElement (): ElementFinder {
        const ele = element(by.css('app-forum-thread-controller input[name="thread-badge"]'));
        browser.wait(ExpectedConditions.presenceOf(ele), 10000, 'Expected new thread badge input to be present');

        return ele;
    }

    static getRoomLinkElement (): ElementFinder {
        const ele = element(by.css('app-forum-thread-controller input[name="thread-roomLink"]'));
        browser.wait(ExpectedConditions.presenceOf(ele), 10000, 'Expected new thread room link input to be present');

        return ele;
    }

    static getThreadEditor (): ElementFinder {
        const ele = element(by.css('app-forum-thread-controller app-editor .wysibb-text-editor'));
        browser.wait(ExpectedConditions.presenceOf(ele), 10000, 'Expected new thread editor to be present');

        return ele;
    }

    static getTag (tag: string): ElementFinder {
        return element(by.cssContainingText('.tag', tag));
    }
}
