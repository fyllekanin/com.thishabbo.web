import { CommonUtil } from '../../utils/common.util';
import { browser, by, element, ExpectedConditions } from 'protractor';
import { InputUtil } from '../../utils/input.util';
import { NavigationUtil } from "../../utils/navigation.util";

export class StaffListPage {

    static addGroup (group: string): void {
        InputUtil.searchInSelect(element(by.css('app-form-select')), group).then(() => {
            CommonUtil.click(element(by.cssContainingText('app-form-select .values div', group)));
            CommonUtil.click(element(by.cssContainingText('select[name="color"] option', 'Red')));

            NavigationUtil.clickTab('Add Group');

            const row = element(by.cssContainingText('app-table tr', group));
            browser.wait(ExpectedConditions.presenceOf(row), 10000, `Expected group ${group} to be in the list`);
        });
    }

    static removeGroup (group: string): void {
        const row = element(by.cssContainingText('app-table tbody tr', group));
        CommonUtil.click(row.element(by.xpath('../../..')).element(by.css('em')));
        CommonUtil.click(row.element(by.xpath('../../..')).element(by.cssContainingText('.action .actions div', 'Remove')));
    }
}
