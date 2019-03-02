import { browser, by, element, ExpectedConditions } from 'protractor';
import { CommonUtil } from './common.util';
import { ForumPage } from '../pages/forum.page';

export class NavigationUtil {

    static clickRegisterPage(): void {
        const ele = element(by.cssContainingText('app-top-box .unregistered a', 'here'));
        CommonUtil.click(ele);
    }

    static clickNavigation(value: string): void {
        browser.sleep(1000);
        browser.executeScript('window.scrollTo(0,0);');
        const ele = element(by.cssContainingText('app-navigation a', value));
        CommonUtil.click(ele);
    }

    static clickUserNavigation(value: string): void {
        browser.executeScript('window.scrollTo(0,0);');
        const selector = 'app-top-box .welcome .logged-in .dropdown';
        const userDropdownEle = element(by.css(selector));
        browser.actions().mouseMove(userDropdownEle).perform();

        const linkEle = element(by.cssContainingText(`${selector} a`, value));
        CommonUtil.click(linkEle);
    }

    static clickUserCpTool(value: string): void {
        const ele = element(by.cssContainingText('app-usercp app-side-menu app-content span', value));
        CommonUtil.click(ele);
    }

    static clickSiteCpTool(value: string): void {
        const ele = element(by.cssContainingText('app-admin app-side-menu app-content span', value));
        CommonUtil.click(ele);
    }

    static clickStaffCpTool(value: string): void {
        const ele = element(by.cssContainingText('app-staff app-side-menu app-content span', value));
        CommonUtil.click(ele);
    }

    static clickButton(value: string): void {
        const ele = element(by.cssContainingText('button', value));
        browser.wait(ExpectedConditions.presenceOf(ele), 5000, `Expected button with text "${value}" to be present`);

        CommonUtil.click(ele);
    }

    static clickTab(value: string, preSelectors?: string): void {
        const ele = element(by.cssContainingText((preSelectors ? `${preSelectors} ` : '') +
            'app-title .wrapper .tab', value));
        CommonUtil.click(ele);
    }

    static clickCategory(value: string): void {
        const ele = ForumPage.getCategoryElement(value);
        CommonUtil.click(ele);
    }

    static clickThread(value: string): void {
        const ele = ForumPage.getThreadElement(value);
        CommonUtil.click(ele);
    }

    static clickFixedTools(value: string): void {
        const ele = element(by.cssContainingText('app-fixed-tools button', value));
        browser.wait(ExpectedConditions.presenceOf(ele), 5000, `Expected fixed tools "${value}" to be present`);
        CommonUtil.click(ele);
    }
}
