import { browser, by, element, ElementFinder, ExpectedConditions, Key, protractor } from 'protractor';
import { CommonUtil } from './common.util';

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

    static clickRowAction(index: number, action: string): void {
        const ele = element.all(by.css('app-table .row')).get(index);
        browser.wait(ExpectedConditions.presenceOf(ele), 10000, `Expected row ${index} to be present`);

        const actionEle = ele.element(by.cssContainingText('select option', action));
        browser.wait(ExpectedConditions.presenceOf(actionEle), 10000, `Expected row ${index} action ${action} to be present`);

        CommonUtil.click(actionEle);
    }
}
