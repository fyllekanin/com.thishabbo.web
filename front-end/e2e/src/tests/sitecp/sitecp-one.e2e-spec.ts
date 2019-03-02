import { CommonUtil } from '../../utils/common.util';
import { NavigationUtil } from '../../utils/navigation.util';
import { BbcodePage } from '../../pages/sitecp/bbcode.page';

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
});
