import { browser, by, element, ElementFinder, ExpectedConditions } from 'protractor';

export class NewThreadPage {

    static getThreadTitleElement(): ElementFinder {
        const ele = element(by.css('app-forum-thread-controller input[name="thread-title"]'));
        browser.wait(ExpectedConditions.presenceOf(ele), 10000, 'Expected new thread title input to be present');

        return ele;
    }

    static getThreadEditor(): ElementFinder {
        const ele = element(by.css('app-forum-thread-controller app-editor .wysibb-text-editor'));
        browser.wait(ExpectedConditions.presenceOf(ele), 10000, 'Expected new thread editor to be present');

        return ele;
    }
}
