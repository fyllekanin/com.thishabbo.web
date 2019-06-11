import { by, element } from 'protractor';
import { InputUtil } from '../../utils/input.util';
import { CommonUtil } from '../../utils/common.util';

export class BettingPage {

    static setCategoryName(name: string): void {
        const ele = element(by.css('app-sitecp-betting-category input[name="name"]'));
        InputUtil.clearInput(ele);
        InputUtil.fillInput(ele, name);
    }

    static setCategoryDisplayOrder(order: number): void {
        const ele = element(by.css('app-sitecp-betting-category input[name="displayOrder"]'));
        InputUtil.fillInput(ele, order);
    }

    static setBetName(name: string): void {
        const ele = element(by.css('app-betting-bet input[name="name"]'));
        InputUtil.clearInput(ele);
        InputUtil.fillInput(ele, name);
    }

    static setBetDisplayOrder(order: number): void {
        const ele = element(by.css('app-betting-bet input[name="displayOrder"]'));
        InputUtil.fillInput(ele, order);
    }

    static setNumerator(value: number): void {
        const ele = element(by.css('app-betting-bet input[name="numerator"]'));
        InputUtil.clearInput(ele);
        InputUtil.fillInput(ele, value);
    }

    static setDenominator(value: number): void {
        const ele = element(by.css('app-betting-bet input[name="denominator"]'));
        InputUtil.clearInput(ele);
        InputUtil.fillInput(ele, value);
    }

    static selectCategory(category: string): void {
        const ele = element(by.cssContainingText('app-betting-bet select[name="category"] option', category));
        CommonUtil.click(ele);
    }

    static setResult(result: string): void {
        const ele = element(by.cssContainingText('app-sitecp-betting-bet-result select option', result));
        CommonUtil.click(ele);
    }
}
