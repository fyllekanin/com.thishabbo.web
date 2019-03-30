import { browser, ElementFinder, ExpectedConditions, Key, protractor } from 'protractor';

export class InputUtil {

    static fillInput(ele: ElementFinder, value: string | number): void {
        browser.wait(ExpectedConditions.presenceOf(ele), 10000, 'Expected element to be present');
        ele.sendKeys(value);
        ele.sendKeys(Key.TAB);
    }

    static clearInput(ele: ElementFinder): void {
        browser.wait(ExpectedConditions.presenceOf(ele), 10000, 'Expected element to be present');
        ele.clear();
    }

    static fillEditor(ele: ElementFinder, value: string | number): void {
        browser.wait(ExpectedConditions.presenceOf(ele), 10000, 'Expected element to be present');
        ele.sendKeys(value);
    }

    static searchInSelect(ele: ElementFinder, value: string) {
        browser.wait(ExpectedConditions.presenceOf(ele), 10000, 'Expected element to be present');
        return browser.actions().mouseMove(ele)
            .click()
            .sendKeys(protractor.Key.chord(protractor.Key.CONTROL, 'a'))
            .sendKeys(protractor.Key.BACK_SPACE)
            .sendKeys(value)
            .perform();
    }
}
