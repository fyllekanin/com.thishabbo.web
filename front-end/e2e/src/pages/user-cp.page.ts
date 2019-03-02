import { browser, by, element, ElementFinder, ExpectedConditions } from 'protractor';
import { CommonUtil } from '../utils/common.util';
import { InputUtil } from '../utils/input.util';

export class UserCpPage {

    static acceptGdpr(): void {
        const gdpr = element(by.css('app-auth-register .cell .checkbox-container'));
        CommonUtil.click(gdpr);
    }

    static fillRegisterInformation(data: {
        username,
        password,
        email
    }) {
        const username = element(by.css('app-auth-register input[name="username"]'));
        const nickname = element(by.css('app-auth-register input[name="nickname"]'));
        const password = element(by.css('app-auth-register input[name="password"]'));
        const repassword = element(by.css('app-auth-register input[name="repassword"]'));
        const email = element(by.css('app-auth-register input[name="email"]'));

        browser.wait(ExpectedConditions.presenceOf(username), 5000, 'Expected username input to be present');
        browser.wait(ExpectedConditions.presenceOf(nickname), 5000, 'Expected nickname input to be present');
        browser.wait(ExpectedConditions.presenceOf(password), 5000, 'Expected password input to be present');
        browser.wait(ExpectedConditions.presenceOf(repassword), 5000, 'Expected repassword input to be present');
        browser.wait(ExpectedConditions.presenceOf(email), 5000, 'Expected email input to be present');

        InputUtil.fillInput(username, data.username);
        InputUtil.fillInput(nickname, data.username);
        InputUtil.fillInput(password, data.password);
        InputUtil.fillInput(repassword, data.password);
        InputUtil.fillInput(email, data.email);
    }

    static getChangePasswordInputs(): Array<ElementFinder> {
        const passwordEle = element(by.css('app-usercp-password input[name="password"]'));
        const repasswordEle = element(by.css('app-usercp-password input[name="repassword"]'));
        const currentPasswordEle = element(by.css('app-usercp-password input[name="currentPassword"]'));

        browser.wait(ExpectedConditions.presenceOf(passwordEle), 5000, 'Expected password input to be present');
        browser.wait(ExpectedConditions.presenceOf(repasswordEle), 5000, 'Expected re-password input to be present');
        browser.wait(ExpectedConditions.presenceOf(currentPasswordEle), 5000, 'Expected current password input to be present');

        return [passwordEle, repasswordEle, currentPasswordEle];
    }

    static getEditHomePageInput(): ElementFinder {
        const ele = element(by.css('app-usercp-home-page input[name="homePage"]'));
        browser.wait(ExpectedConditions.presenceOf(ele), 5000, 'Expected home page input to be present');

        return ele;
    }

    static getSignatureEditor(): ElementFinder {
        const ele = element(by.css('app-usercp-signature app-editor iframe'));
        browser.wait(ExpectedConditions.presenceOf(ele), 5000, 'Expected signature editor to be present');

        return ele;
    }

    static getThreadSubscription(value: string): ElementFinder {
        return element(by.cssContainingText('app-usercp-thread-subscriptions table td', value));
    }

    static applyToGroup(value: string): void {
        const ele = element(by.cssContainingText('.groups', value)).element(by.xpath('..'))
            .element(by.cssContainingText('span', 'Apply'));
        CommonUtil.click(ele);
    }

    static getGroupStatus(value: string): ElementFinder {
        return element(by.cssContainingText('.groups', value)).element(by.xpath('..'))
            .element(by.css('span'));
    }
}
