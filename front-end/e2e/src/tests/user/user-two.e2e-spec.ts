import { CommonUtil } from '../../utils/common.util';
import { NavigationUtil } from '../../utils/navigation.util';
import { UserCpPage } from '../../pages/user-cp.page';
import { InputUtil } from '../../utils/input.util';

describe('User #2', () => {
    const USERNAME = 'tovven';
    const PASSWORD = 'test1234';

    beforeEach(() => {
        CommonUtil.open('/home');
        NavigationUtil.clickUserNavigation('Logout');
        CommonUtil.login(USERNAME, PASSWORD);
    });

    it('should be possible to update habbo', () => {
        const oldHabbo = 'bear94';
        const newHabbo = 'keys3r';

        NavigationUtil.clickUserNavigation('UserCP');
        NavigationUtil.clickUserCpTool('Edit Habbo');
        expect(UserCpPage.getCurrentHabbo().getText()).toEqual(oldHabbo);

        InputUtil.fillInput(UserCpPage.getHabboInput(), newHabbo);
        NavigationUtil.clickTab('Save');
        expect(UserCpPage.getCurrentHabbo().getText()).toEqual(newHabbo);
    });
});
