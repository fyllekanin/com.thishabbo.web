import { by, element } from 'protractor';
import { InputUtil } from '../../utils/input.util';
import { CommonUtil } from '../../utils/common.util';

export class BbcodePage {

    static edit(index: number): void {
        const selector = element.all(by.css('.row')).get(index);

        const option = selector.element(by.cssContainingText('option', 'Edit BBCode'));
        CommonUtil.click(option);
    }

    static setName(value: string): void {
        const ele = element(by.css('input[name="bbcode-name"]'));
        InputUtil.clearInput(ele);
        InputUtil.fillInput(ele, value);
    }

    static setExample(value: string): void {
        const ele = element(by.css('input[name="bbcode-example"]'));
        InputUtil.clearInput(ele);
        InputUtil.fillInput(ele, value);
    }

    static setPattern(value: string): void {
        const ele = element(by.css('input[name="bbcode-pattern"]'));
        InputUtil.clearInput(ele);
        InputUtil.fillInput(ele, value);
    }

    static setReplace(value: string): void {
        const ele = element(by.css('input[name="bbcode-replace"]'));
        InputUtil.clearInput(ele);
        InputUtil.fillInput(ele, value);
    }

    static setContent(value: string): void {
        const ele = element(by.css('input[name="bbcode-content"]'));
        InputUtil.clearInput(ele);
        InputUtil.fillInput(ele, value);
    }
}
