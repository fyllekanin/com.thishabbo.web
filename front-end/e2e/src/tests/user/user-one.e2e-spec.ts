import { CommonUtil } from '../../utils/common.util';
import { NavigationUtil } from '../../utils/navigation.util';
import { InputUtil } from '../../utils/input.util';
import { UserCpPage } from '../../pages/user-cp.page';
import { ForumPage } from '../../pages/forum.page';
import { ThreadPage } from '../../pages/thread.page';

describe('User #1', () => {
    const USERNAME = 'test';
    const PASSWORD = 'test1234';
    const NEW_PASSWORD = 'test4321';
    const NEW_SIGNATURE = 'This is my new signature';

    beforeEach(() => {
        CommonUtil.open('/home');
    });

    it('should be possible to login', () => {
        NavigationUtil.clickUserCpTool('Logout');
        CommonUtil.login(USERNAME, PASSWORD);

        expect(CommonUtil.getNicknameElement().getText()).toEqual('test');
    });

    it('should be possible to change password', () => {
        CommonUtil.login(USERNAME, PASSWORD);
        NavigationUtil.clickUserNavigation('UserCP');
        NavigationUtil.clickUserCpTool('Change Password');

        const inputs = UserCpPage.getChangePasswordInputs();
        InputUtil.fillInput(inputs[2], PASSWORD);
        InputUtil.fillInput(inputs[0], NEW_PASSWORD);
        InputUtil.fillInput(inputs[1], NEW_PASSWORD);

        NavigationUtil.clickTab('Save');
        NavigationUtil.clickUserNavigation('Logout');

        CommonUtil.login(USERNAME, NEW_PASSWORD);
        expect(CommonUtil.getNicknameElement().getText()).toEqual('test');
    });

    it('should be possible to edit home page', () => {
        CommonUtil.login(USERNAME, PASSWORD);
        NavigationUtil.clickUserNavigation('UserCP');
        NavigationUtil.clickUserCpTool('Edit Home Page');

        InputUtil.fillInput(UserCpPage.getEditHomePageInput(), '/forum');
        NavigationUtil.clickTab('Save');

        NavigationUtil.clickUserNavigation('Logout');
        CommonUtil.login(USERNAME, NEW_PASSWORD);

        expect(ForumPage.getCategoryElement('Announcements').isPresent()).toBeTruthy();
    });

    it('should be possible to update the signature', () => {
        CommonUtil.login(USERNAME, PASSWORD);
        NavigationUtil.clickNavigation('Forum');
        NavigationUtil.clickCategory('Reports');
        NavigationUtil.clickCategory('Sorted Reports');
        NavigationUtil.clickThread('Report by test');
        expect(ThreadPage.getPostSignature(0).isPresent()).toBeFalsy();

        NavigationUtil.clickUserNavigation('UserCP');
        NavigationUtil.clickUserCpTool('Edit Signature');

        InputUtil.fillEditor(UserCpPage.getSignatureEditor(), NEW_SIGNATURE);
        NavigationUtil.clickTab('Save');

        NavigationUtil.clickNavigation('Forum');
        NavigationUtil.clickCategory('Reports');
        NavigationUtil.clickCategory('Sorted Reports');
        NavigationUtil.clickThread('Report by test');

        expect(ThreadPage.getPostSignature(0).getText()).toEqual(NEW_SIGNATURE);
    });

    it('should be possible to apply for a public group', () => {
        CommonUtil.login(USERNAME, PASSWORD);
        NavigationUtil.clickUserNavigation('UserCP');
        NavigationUtil.clickUserCpTool('Groups');

        UserCpPage.applyToGroup('Male');
        NavigationUtil.clickButton('Yes');

        expect(UserCpPage.getGroupStatus('Male').getText()).toEqual('Waiting approval or denial');
    });

    it('should be possible to register on the website', () => {
        CommonUtil.login(USERNAME, PASSWORD);
        NavigationUtil.clickUserNavigation('Logout');
        NavigationUtil.clickRegisterPage();
        UserCpPage.fillRegisterInformation({
            username: 'erico',
            password: 'test1234',
            email: 'erico@thishabbo.com'
        });
        UserCpPage.acceptGdpr();
        NavigationUtil.clickButton('Register');

        CommonUtil.login('erico', 'test1234');

        expect(CommonUtil.getNicknameElement().getText()).toEqual('erico');
    });
});
