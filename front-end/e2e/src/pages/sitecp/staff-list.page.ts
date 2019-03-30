import { CommonUtil } from '../../utils/common.util';
import { browser, by, element, ExpectedConditions } from 'protractor';
import { InputUtil } from '../../utils/input.util';

export class StaffListPage {

    static addGroup(group: string): void {
        InputUtil.clearInput(element(by.css('app-form-select')));
        InputUtil.fillInput(element(by.css('app-form-select')), group);

        CommonUtil.click(element(by.css('app-form-select')));
        CommonUtil.click(element(by.cssContainingText('app-form-select div', group)));

        CommonUtil.click(element(by.cssContainingText('button', 'Add Group')));

        const row = element(by.cssContainingText('app-table .row', group));
        browser.wait(ExpectedConditions.presenceOf(row), 10000, `Expected group ${group} to be in the list`);
    }

    static removeGroup(group: string): void {
        const row = element(by.cssContainingText('app-table .row span', group));
        const button = row.element(by.xpath('../../../..')).element(by.cssContainingText('button', 'Remove'));
        CommonUtil.click(button);
    }
}
