import { CommonUtil } from '../../utils/common.util';
import { NavigationUtil } from '../../utils/navigation.util';
import { BbcodePage } from '../../pages/sitecp/bbcode.page';
import { StaffListPage } from '../../pages/sitecp/staff-list.page';
import { BettingPage } from '../../pages/sitecp/betting.page';
import { InputUtil } from '../../utils/input.util';

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
        BbcodePage.setPattern('/\[new\](.?)\]\/new\]/');
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
        BettingPage.setName(categoryName);
        BettingPage.setDisplayOrder(0);

        NavigationUtil.clickTab('Save');
        NavigationUtil.clickTab('Cancel');
        expect(CommonUtil.getTableRows().count()).toEqual(3);

        CommonUtil.enterTableFilter('Filter on category name', categoryName);
        expect(CommonUtil.getTableRows().count()).toEqual(1);

        InputUtil.clickRowAction(0, 'Edit');
        BettingPage.setName(newCategoryName);
        NavigationUtil.clickTab('Save');
        NavigationUtil.clickTab('Cancel');

        CommonUtil.enterTableFilter('Filter on category name', newCategoryName);
        expect(CommonUtil.getTableRows().count()).toEqual(1);

        InputUtil.clickRowAction(0, 'Delete');
        NavigationUtil.clickButton('Yes');
        expect(CommonUtil.getTableRows().count()).toEqual(0);
    });
});
