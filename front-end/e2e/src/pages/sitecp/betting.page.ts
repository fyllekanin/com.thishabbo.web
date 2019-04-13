import { by, element } from 'protractor';
import { InputUtil } from '../../utils/input.util';

export class BettingPage {

    static setName(name: string): void {
        const ele = element(by.css('app-admin-betting-category input[name="name"]'));
        InputUtil.clearInput(ele);
        InputUtil.fillInput(ele, name);
    }

    static setDisplayOrder(order: number): void {
        const ele = element(by.css('app-admin-betting-category input[name="displayOrder"]'));
        InputUtil.fillInput(ele, order);
    }
}
