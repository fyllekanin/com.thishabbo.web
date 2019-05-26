import { CommonUtil } from '../../utils/common.util';
import { NavigationUtil } from '../../utils/navigation.util';
import { BbcodePage } from '../../pages/sitecp/bbcode.page';
import { StaffListPage } from '../../pages/sitecp/staff-list.page';
import { BettingPage } from '../../pages/sitecp/betting.page';
import { InputUtil } from '../../utils/input.util';
import { by, element } from 'protractor';

describe('SiteCP #1', () => {
    const USERNAME = 'tovven';
    const PASSWORD = 'test1234';

    beforeEach(() => {
        CommonUtil.open('/home');

        NavigationUtil.clickUserNavigation('Logout');
        CommonUtil.login(USERNAME, PASSWORD);
        CommonUtil.open('/admin/dashboard');
    });

    it('should be possible to create, edit and delete a bbcode', () => {
        const bbcodeName = 'new-bbcode';
        const updatedName = 'bbcode';

        NavigationUtil.clickSiteCpTool('Manage BBCode');
        NavigationUtil.clickTab('New BBCode');

        BbcodePage.setName(bbcodeName);
        BbcodePage.setContent('$1');
        BbcodePage.setExample('[new]New[/new]');
        BbcodePage.setPattern('/\\\\[new\\\\](((?R)|.)*?)\\\\[\\\\/new\\\\]/si');
        BbcodePage.setReplace('<new>$1</new>');

        NavigationUtil.clickTab('Save');
        NavigationUtil.clickTab('Cancel');

        BbcodePage.edit(5);
        BbcodePage.setName(updatedName);
        NavigationUtil.clickTab('Save');
        NavigationUtil.clickTab('Cancel');

        BbcodePage.edit(5);
        NavigationUtil.clickTab('Delete');
        NavigationUtil.clickButton('Yes');
    });

    it('should be possible to add and remove groups from the staff list', () => {
        NavigationUtil.clickSiteCpTool('Manage Staff List');

        StaffListPage.addGroup('Female');
        expect(CommonUtil.getTableRows().count()).toBe(1);

        NavigationUtil.clickTab('Save');
        NavigationUtil.clickSiteCpTool('Manage BBCode');
        NavigationUtil.clickSiteCpTool('Manage Staff List');
        expect(CommonUtil.getTableRows().count()).toBe(1);

        StaffListPage.removeGroup('Female');
        expect(CommonUtil.getTableRows().count()).toBe(0);
        NavigationUtil.clickTab('Save');
        NavigationUtil.clickSiteCpTool('Manage BBCode');
        NavigationUtil.clickSiteCpTool('Manage Staff List');
        expect(CommonUtil.getTableRows().count()).toBe(0);
    });

    it('should be possible to create, update and delete a betting category', () => {
        const categoryName = 'Category #1';
        const newCategoryName = 'Category #2';

        NavigationUtil.clickSiteCpTool('Betting Categories');

        NavigationUtil.clickTab('Create Category');
        BettingPage.setCategoryName(categoryName);
        BettingPage.setCategoryDisplayOrder(1);

        NavigationUtil.clickTab('Save');
        NavigationUtil.clickTab('Cancel');
        expect(CommonUtil.getTableRows().count()).toEqual(3);

        CommonUtil.enterTableFilter('Filter on category name', categoryName);
        expect(CommonUtil.getTableRows().count()).toEqual(1);

        InputUtil.clickRowAction(0, 'Edit');
        BettingPage.setCategoryName(newCategoryName);
        NavigationUtil.clickTab('Save');
        NavigationUtil.clickTab('Cancel');

        CommonUtil.enterTableFilter('Filter on category name', newCategoryName);
        expect(CommonUtil.getTableRows().count()).toEqual(1);

        InputUtil.clickRowAction(0, 'Delete');
        NavigationUtil.clickButton('Yes');
        expect(CommonUtil.getTableRows().count()).toEqual(0);
    });

    it('should be possible to create, update, suspend, set result and delete a bet', () => {
        const betName = 'Bet #1';
        const newBetName = 'Bet #2';

        NavigationUtil.clickSiteCpTool('Bets');

        NavigationUtil.clickTab('Create Bet');
        BettingPage.setBetName(betName);
        BettingPage.selectCategory('Staff');
        BettingPage.setBetDisplayOrder(1);
        BettingPage.setNumerator(1);
        BettingPage.setDenominator(1);

        NavigationUtil.clickTab('Save');
        NavigationUtil.clickTab('Cancel');
        expect(CommonUtil.getTableRows().count()).toEqual(4);

        CommonUtil.enterTableFilter('Filter on bet title', betName);
        InputUtil.clickRowAction(0, 'Edit');

        BettingPage.setBetName(newBetName);
        NavigationUtil.clickTab('Save');
        NavigationUtil.clickTab('Cancel');

        CommonUtil.enterTableFilter('Filter on bet title', newBetName);
        expect(CommonUtil.getTableRows().count()).toEqual(1);

        InputUtil.clickRowAction(0, 'Suspend');
        InputUtil.clickRowAction(0, 'Unsuspend');

        InputUtil.clickRowAction(0, 'Set Result');
        BettingPage.setResult('Win');
        NavigationUtil.clickButton('Done');

        InputUtil.clickRowAction(0, 'Delete');
        NavigationUtil.clickButton('Yes');
        expect(CommonUtil.getTableRows().count()).toEqual(0);
    });

    it('should be possible to ban a user', () => {
        CommonUtil.scrollToBottom();
        NavigationUtil.clickSiteCpTool('Manage Users');
        CommonUtil.enterTableFilter('Search for users...', 'test');
        InputUtil.clickRowAction(0, 'Manage Bans');

        NavigationUtil.clickTab('Ban');
        InputUtil.selectOption(element(by.css('app-admin-user-ban-reason select')), '1 hour');
        InputUtil.fillInput(element(by.css('app-admin-user-ban-reason input')), 'You are banned');

        NavigationUtil.clickButton('Ban');
        NavigationUtil.clickUserNavigation('Logout');

        CommonUtil.login('test', 'test4321');
        expect(element(by.cssContainingText('.global-notification-message', 'This account is banned until')));
    });
});
