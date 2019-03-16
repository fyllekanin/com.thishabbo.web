import { browser, by, element, ElementFinder, ExpectedConditions } from 'protractor';
import { InputUtil } from './input.util';

export class CommonUtil {

    static open(url: string = '/'): void {
        browser.get(url);
    }

    static isLoggedIn() {
        return element(by.css('app-top-box .welcome .logged-in .dropdown')).isPresent();
    }

    static login(username: string, password: string): void {
        const usernameInput = element(by.css('app-top-bar input[name="loginName"]'));
        InputUtil.fillInput(usernameInput, username);

        const passwordInput = element(by.css('app-top-bar input[name="password"]'));
        InputUtil.fillInput(passwordInput, password);

        const loginButton = element(by.cssContainingText('app-top-bar button', 'Login'));
        CommonUtil.click(loginButton);
        browser.sleep(1000);
        browser.actions().mouseMove(element(by.css('app-top-bar')), { y: 0, x: 0 });
        browser.sleep(1000);

        const experience = element(by.css('app-top-box .experience'));
        browser.wait(ExpectedConditions.presenceOf(experience), 10000, 'Expected user to be logged in');
    }

    static getNicknameElement(): ElementFinder {
        const nicknameEle = element(by.css('app-top-box .welcome .logged-in .nickname'));
        browser.wait(ExpectedConditions.presenceOf(nicknameEle), 10000, 'Expected nickname to be present');
        return nicknameEle;
    }

    static click(ele: ElementFinder): void {
        browser.actions().mouseMove(ele).perform();
        browser.wait(ExpectedConditions.elementToBeClickable(ele), 10000, `Expected element to be clickable`);
        ele.click();

        const loadingWrapper = element(by.css('.loading-wrapper'));
        browser.wait(ExpectedConditions.invisibilityOf(loadingWrapper), 10000, 'Expected loading wrapper to be gone');
        browser.sleep(200);
    }

    static getTableRows() {
        return element.all(by.css('app-table .row'));
    }

    static enterTableFilter(placeholder: string, value: string): void {
        const ele = element(by.css('app-table .filter input[placeholder="' + placeholder + '"]'));
        browser.wait(ExpectedConditions.presenceOf(ele), 10000, `Expected table filter with placeholder "${placeholder}" to be present`);

        InputUtil.fillInput(ele, value);
    }
}
