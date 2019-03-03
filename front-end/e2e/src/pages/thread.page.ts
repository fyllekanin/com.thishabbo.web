import { browser, by, element, ElementFinder, ExpectedConditions } from 'protractor';

export class ThreadPage {

    static getPostSignature(index: number): ElementFinder {
        return element.all(by.css('app-forum-post .signature')).get(index);
    }

    static getPostEditor(): ElementFinder {
        const ele = element(by.css('app-forum-thread .new-post-editor app-editor iframe'));
        browser.wait(ExpectedConditions.presenceOf(ele), 10000, 'Expected new post editor to be present');
        browser.sleep(3000);
        browser.executeScript('window.scrollTo(0, document.body.scrollHeight)');

        return ele;
    }

    static getPostOwner(index: number): ElementFinder {
        const ele = element.all(by.css('.post-nickname')).get(index);
        browser.wait(ExpectedConditions.presenceOf(ele), 10000, `Expected post ${index} to be present`);

        return ele;
    }

    static getChangeOwnerInput(): ElementFinder {
        const ele = element(by.css('input[placeholder="Nickname of new owner"]'));
        browser.wait(ExpectedConditions.presenceOf(ele), 10000, `Expected change owner input to be present`);

        return ele;
    }
}
