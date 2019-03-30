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

    static searchInSelect(ele: ElementFinder, value: string): void {
        browser.wait(ExpectedConditions.presenceOf(ele), 10000, 'Expected element to be present');
        ele.sendKeys(protractor.Key.chord(protractor.Key.COMMAND, 'a'));
        ele.sendKeys(protractor.Key.BACK_SPACE);
        ele.sendKeys(value);
    }
}
