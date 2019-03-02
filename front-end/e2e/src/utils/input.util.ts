import { browser, by, element, ElementFinder, ExpectedConditions, Key } from 'protractor';

export class InputUtil {

    static fillInput(ele: ElementFinder, value: string | number): void {
        browser.wait(ExpectedConditions.presenceOf(ele), 5000, 'Expected element to be present');
        ele.sendKeys(value);
        ele.sendKeys(Key.TAB);
    }

    static clearInput(ele: ElementFinder): void {
        browser.wait(ExpectedConditions.presenceOf(ele), 5000, 'Expected element to be present');
        ele.clear();
    }

    static fillEditor(ele: ElementFinder, value: string | number): void {
        browser.wait(ExpectedConditions.presenceOf(ele), 5000, 'Expected element to be present');
        browser.waitForAngularEnabled(false);
        browser.switchTo().frame(ele.getWebElement());

        const body = element(by.css('body'));
        body.sendKeys(value);

        browser.switchTo().defaultContent();
        browser.waitForAngularEnabled(true);
        browser.waitForAngular();
    }
}
