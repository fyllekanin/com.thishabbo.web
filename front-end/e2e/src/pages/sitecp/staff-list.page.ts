import { CommonUtil } from '../../utils/common.util';
import { by, element } from 'protractor';

export class StaffListPage {

    static addGroup(group: string): void {
        CommonUtil.click(element(by.css('app-form-select')));
        CommonUtil.click(element(by.cssContainingText('app-form-select div', group)));

        CommonUtil.click(element(by.cssContainingText('button', 'Add Group')));
    }

    static removeGroup(group: string): void {
        const row = element(by.cssContainingText('app-table .row span', group));
        const button = row.element(by.xpath('../../../')).element(by.cssContainingText('button', 'Remove'));
        CommonUtil.click(button);
    }
}
