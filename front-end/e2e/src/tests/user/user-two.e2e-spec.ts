import { CommonUtil } from '../../utils/common.util';
import { NavigationUtil } from '../../utils/navigation.util';
import { UserCpPage } from '../../pages/user-cp.page';
import { InputUtil } from '../../utils/input.util';
import { ForumPage } from '../../pages/forum.page';

describe('User #2', () => {
    const USERNAME = 'tovven';
    const PASSWORD = 'test1234';

    beforeEach(() => {
        CommonUtil.open('/home');
        NavigationUtil.clickUserNavigation('Logout');
        CommonUtil.login(USERNAME, PASSWORD);
        CommonUtil.open('/user/usercp');
    });

    it('should be possible to update habbo', () => {
        const oldHabbo = 'bear94';
        const newHabbo = 'keys3r';

        NavigationUtil.clickUserCpTool('Edit Habbo');
        expect(UserCpPage.getCurrentHabbo().getText()).toEqual(oldHabbo);

        InputUtil.fillInput(UserCpPage.getHabboInput(), newHabbo);
        NavigationUtil.clickTab('Save');
        expect(UserCpPage.getCurrentHabbo().getText()).toEqual(newHabbo);
    });

    it('should default forum tools to hidden and test device setting', () => {
        NavigationUtil.clickNavigation('Forum');
        NavigationUtil.clickCategory('Welcome!');
        NavigationUtil.clickThread('Welcome test!');
        expect(ForumPage.getFixedToolsElement('Post Tools').isPresent()).toBeFalsy();

        NavigationUtil.clickUserNavigation('UserCP');
        UserCpPage.toggleSetting('Forum Tools');
        NavigationUtil.clickTab('Save');

        NavigationUtil.clickNavigation('Forum');
        NavigationUtil.clickCategory('Welcome!');
        NavigationUtil.clickThread('Welcome test!');
        expect(ForumPage.getFixedToolsElement('Post Tools').isPresent()).toBeTruthy();

        NavigationUtil.clickUserNavigation('UserCP');
        UserCpPage.toggleSetting('Forum Tools');
        NavigationUtil.clickTab('Save');
    });
});
