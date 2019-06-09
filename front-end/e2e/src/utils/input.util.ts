import { browser, by, element, ElementFinder, ExpectedConditions, Key, protractor } from 'protractor';
import { CommonUtil } from './common.util';

export class InputUtil {

    static clearAndFillInput (ele: ElementFinder, value: string | number): void {
        this.clearInput(ele);
        this.fillInput(ele, value);
    }

    static fillInput (ele: ElementFinder, value: string | number): void {
        browser.wait(ExpectedConditions.presenceOf(ele), 10000, 'Expected element to be present');
        ele.sendKeys(value);
        ele.sendKeys(Key.TAB);
    }

    static clearInput (ele: ElementFinder): void {
        browser.wait(ExpectedConditions.presenceOf(ele), 10000, 'Expected element to be present');
        ele.clear();
    }

    static fillEditor (ele: ElementFinder, value: string | number): void {
        browser.wait(ExpectedConditions.presenceOf(ele), 10000, 'Expected element to be present');
        ele.sendKeys(value);
    }

    static searchInSelect (ele: ElementFinder, value: string) {
        browser.wait(ExpectedConditions.presenceOf(ele), 10000, 'Expected element to be present');
        return browser.actions().mouseMove(ele)
            .click()
            .sendKeys(protractor.Key.chord(protractor.Key.CONTROL, 'a'))
            .sendKeys(protractor.Key.BACK_SPACE)
            .sendKeys(value)
            .perform();
    }

    static selectOption (selectElement: ElementFinder, value): void {
        const actionEle = selectElement.element(by.cssContainingText('option', value));
        browser.wait(ExpectedConditions.presenceOf(actionEle), 10000, `Expected value ${value} to be present`);

        CommonUtil.click(actionEle);
    }

    static clickRowAction (index: number, action: string): void {
        const ele = element.all(by.css('app-table .row select')).get(index);
        browser.wait(ExpectedConditions.presenceOf(ele), 10000, `Expected row ${index} to be present`);

        InputUtil.selectOption(ele, action);
    }
}
