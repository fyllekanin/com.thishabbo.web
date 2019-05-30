import { CommonUtil } from '../../utils/common.util';
import { NavigationUtil } from '../../utils/navigation.util';
import { StaffCpPage } from '../../pages/staff-cp.page';
import { browser } from 'protractor';
import { InputUtil } from '../../utils/input.util';

describe('StaffCP #1', () => {
    const USERNAME = 'tovven';
    const PASSWORD = 'test1234';

    beforeEach(done => {
        CommonUtil.open('/home');
        CommonUtil.isLoggedIn().then(isLoggedIn => {
            if (isLoggedIn) {
                NavigationUtil.clickUserNavigation('Logout');
            }
            CommonUtil.login(USERNAME, PASSWORD);
            CommonUtil.open('/staff/dashboard');
            done();
        });
    });

    it('should be possible to book & unbook a radio slot', () => {
        NavigationUtil.clickStaffCpTool('Radio Timetable');

        expect(StaffCpPage.getTimetableElement('12PM - Book').isPresent()).toBeTruthy();
        CommonUtil.click(StaffCpPage.getTimetableElement('12PM - Book'));
        NavigationUtil.clickButton('Book');
        expect(StaffCpPage.getTimetableElement('12PM - Tovven').isPresent()).toBeTruthy();

        browser.sleep(1000);
        CommonUtil.click(StaffCpPage.getTimetableElement('12PM - Tovven'));
        NavigationUtil.clickButton('Yes');
        expect(StaffCpPage.getTimetableElement('12PM - Book').isPresent()).toBeTruthy();
    });

    it('should be possible to book & unbook a events slot', () => {
        NavigationUtil.clickStaffCpTool('Events Timetable');

        expect(StaffCpPage.getTimetableElement('12PM - Book').isPresent()).toBeTruthy();
        CommonUtil.click(StaffCpPage.getTimetableElement('12PM - Book'));
        StaffCpPage.selectEventType('Dangerzone');
        NavigationUtil.clickButton('Book');
        expect(StaffCpPage.getTimetableElement('12PM - Tovven (Dangerzone)').isPresent()).toBeTruthy();

        browser.sleep(1000);
        CommonUtil.click(StaffCpPage.getTimetableElement('12PM - Tovven (Dangerzone)'));
        NavigationUtil.clickButton('Yes');

        browser.sleep(1000);
        expect(StaffCpPage.getTimetableElement('12PM - Book').isPresent()).toBeTruthy();
    });

    it('should be possible to create and delete a new events type', () => {
        NavigationUtil.clickStaffCpTool('Manage Event Types');
        NavigationUtil.clickTab('Create New');

        InputUtil.fillInput(StaffCpPage.getNewEventTypeInput(), 'Bank Game');
        NavigationUtil.clickButton('Create');

        CommonUtil.enterTableFilter('Search for Event Types...', 'Bank Game');
        expect(CommonUtil.getTableRows().count()).toEqual(1);
    });

    it('should be possible to create a permanent show', () => {
        browser.executeScript('window.scrollTo(0, document.body.scrollHeight)');
        browser.sleep(1000);
        NavigationUtil.clickStaffCpTool('Manage Permanent Shows');
        NavigationUtil.clickTab('New Permanent Show');

        StaffCpPage.setPermanentShowName('Rock Show');
        StaffCpPage.setPermanentType('Radio');
        StaffCpPage.setPermanentShowDescription('This is a rock-n-roll show!');
        StaffCpPage.setPermanentShowNickname('Tovven');
        StaffCpPage.setPermanentShowDay('Monday');
        StaffCpPage.setPermanentShowHour('12:00 PM');

        NavigationUtil.clickTab('Save');
        NavigationUtil.clickTab('Cancel');
        expect(CommonUtil.getTableRows().count()).toEqual(1);
    });

    it('should be possible to update connection information', () => {
        browser.executeScript('window.scrollTo(0, document.body.scrollHeight)');
        browser.sleep(1000);
        NavigationUtil.clickStaffCpTool('Manage Connection Information');

        StaffCpPage.setRadioInfoIP('test.thishabbo.com');
        StaffCpPage.setRadioInfoPort('8081');
        StaffCpPage.setRadioInfoPassword('ThIsIsANewPassword');
        StaffCpPage.setRadioInfoAdminPassword('ThisIsATestAdminPassword');
        NavigationUtil.clickTab('Save');

        browser.sleep(1000);
        NavigationUtil.clickStaffCpTool('Connection Information');
        expect(StaffCpPage.checkConnectionIP().getText()).toBe('test.thishabbo.com');
    });
});
