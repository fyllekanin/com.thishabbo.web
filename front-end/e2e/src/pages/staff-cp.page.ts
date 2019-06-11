import { browser, by, element, ElementFinder, ExpectedConditions } from 'protractor';
import { CommonUtil } from '../utils/common.util';
import { InputUtil } from '../utils/input.util';

export class StaffCpPage {

    static getTimetableElement(value: string): ElementFinder {
        return element(by.cssContainingText('app-staff-timetable span', value));
    }

    static getEventTypeOption(value: string): ElementFinder {
        return element(by.cssContainingText('option', value));
    }

    static selectEventType(value: string): void {
        const ele = StaffCpPage.getEventTypeOption(value);
        browser.wait(ExpectedConditions.presenceOf(ele), 10000, `Expected event type ${value} to be present`);

        CommonUtil.click(ele);
    }

    static getNewEventTypeInput(): ElementFinder {
        const ele = element(by.css('input[placeholder="Event name..."]'));
        browser.wait(ExpectedConditions.presenceOf(ele), 10000, `Expected new event type input to be present`);

        return ele;
    }

    static setPermanentShowName(value: string): void {
        const ele = element(by.css('input[name="perm-name"]'));
        InputUtil.fillInput(ele, value);
    }

    static setPermanentType(value: string): void {
        const ele = element(by.cssContainingText('select[name="perm-type"] option', value));
        CommonUtil.click(ele);
    }

    static setPermanentShowDescription(value: string): void {
        const ele = element(by.css('input[name="perm-desc"]'));
        InputUtil.fillInput(ele, value);
    }

    static setPermanentShowNickname(value: string): void {
        const ele = element(by.css('input[name="perm-user"]'));
        InputUtil.fillInput(ele, value);
    }

    static setPermanentShowDay(value: string): void {
        const ele = element(by.cssContainingText('select[name="perm-day"] option', value));
        CommonUtil.click(ele);
    }

    static setPermanentShowHour(value: string): void {
        const ele = element(by.cssContainingText('select[name="perm-hour"] option', value));
        CommonUtil.click(ele);
    }

    static setRadioInfoIP(value: string): void {
        const ele = element(by.css('input[name="info-ip"]'));
        InputUtil.clearInput(ele);
        InputUtil.fillInput(ele, value);
    }

    static setRadioInfoPort(value: string): void {
        const ele = element(by.css('input[name="info-port"]'));
        InputUtil.clearInput(ele);
        InputUtil.fillInput(ele, value);
    }

    static setRadioInfoPassword(value: string): void {
        const ele = element(by.css('input[name="info-password"]'));
        InputUtil.clearInput(ele);
        InputUtil.fillInput(ele, value);
    }

    static setRadioInfoSitecpPassword(value: string): void {
        const ele = element(by.css('input[name="info-sitecp-password"]'));
        InputUtil.clearInput(ele);
        InputUtil.fillInput(ele, value);
    }

    static checkConnectionIP(): ElementFinder {
        return element(by.name('info-ip'));
    }
}
