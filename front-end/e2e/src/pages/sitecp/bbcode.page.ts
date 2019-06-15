import { by, element } from 'protractor';
import { InputUtil } from '../../utils/input.util';

export class BbcodePage {

    static edit (index: number): void {
        InputUtil.clickRowAction(index, 'Edit BBCode');
    }

    static setName (value: string): void {
        const ele = element(by.css('input[name="bbcode-name"]'));
        InputUtil.clearAndFillInput(ele, value);
    }

    static setExample (value: string): void {
        const ele = element(by.css('input[name="bbcode-example"]'));
        InputUtil.clearAndFillInput(ele, value);
    }

    static setPattern (value: string): void {
        const ele = element(by.css('input[name="bbcode-pattern"]'));
        InputUtil.clearAndFillInput(ele, value);
    }

    static setReplace (value: string): void {
        const ele = element(by.css('input[name="bbcode-replace"]'));
        InputUtil.clearAndFillInput(ele, value);
    }

    static setContent (value: string): void {
        const ele = element(by.css('input[name="bbcode-content"]'));
        InputUtil.clearAndFillInput(ele, value);
    }
}
