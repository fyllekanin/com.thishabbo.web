import { NavigationUtil } from '../../utils/navigation.util';
import { CommonUtil } from '../../utils/common.util';
import { NewThreadPage } from '../../pages/new-thread.page';
import { InputUtil } from '../../utils/input.util';

xdescribe('Fourm #2', () => {
    const USERNAME = 'tovven';
    const PASSWORD = 'test1234';

    beforeEach(done => {
        CommonUtil.open('/forum');
        CommonUtil.isLoggedIn().then(isLoggedIn => {
            if (isLoggedIn) {
                NavigationUtil.clickUserNavigation('Logout');
            }
            CommonUtil.login(USERNAME, PASSWORD);
            done();
        });
    });

    it('should be possible to create and update a quest thread', () => {
        NavigationUtil.clickCategory('Quests');
        NavigationUtil.clickTab('Create Thread');

        InputUtil.fillInput(NewThreadPage.getThreadTitleElement(), 'Quest Thread');

    });

    it('should be possible to create and update a media thread', () => {

    });
});
