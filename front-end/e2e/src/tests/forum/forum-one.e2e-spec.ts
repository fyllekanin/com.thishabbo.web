import { NavigationUtil } from '../../utils/navigation.util';
import { CommonUtil } from '../../utils/common.util';
import { NewThreadPage } from '../../pages/new-thread.page';
import { InputUtil } from '../../utils/input.util';
import { UserCpPage } from '../../pages/user-cp.page';
import { ForumPage } from '../../pages/forum.page';
import { ThreadPage } from '../../pages/thread.page';
import { browser } from 'protractor';

describe('Forum #1', () => {
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

    it('should be possible to create a thread and be subscribed after', () => {
        NavigationUtil.clickNavigation('Forum');

        NavigationUtil.clickCategory('Dev News');
        NavigationUtil.clickTab('Create Thread');

        InputUtil.fillInput(NewThreadPage.getThreadTitleElement(), 'New Tests');
        InputUtil.fillEditor(NewThreadPage.getThreadEditor(), 'We are now having newly written E2E tests!');
        NavigationUtil.clickTab('Create');

        NavigationUtil.clickUserNavigation('UserCP');
        browser.executeScript('window.scrollTo(0, document.body.scrollHeight)');
        browser.sleep(3000);
        NavigationUtil.clickUserCpTool('Edit Thread Subscriptions');
        expect(UserCpPage.getThreadSubscription('New Tests').isPresent()).toBeTruthy();

        NavigationUtil.clickNavigation('Forum');
        NavigationUtil.clickCategory('Dev News');
        NavigationUtil.clickThread('New Tests');
        NavigationUtil.clickTab('Unsubscribe');

        NavigationUtil.clickUserNavigation('UserCP');
        browser.executeScript('window.scrollTo(0, document.body.scrollHeight)');
        browser.sleep(3000);
        NavigationUtil.clickUserCpTool('Edit Thread Subscriptions');
        expect(UserCpPage.getThreadSubscription('New Tests').isPresent()).toBeFalsy();
    });

    it('should be possible to open and close a thread', () => {
        NavigationUtil.clickNavigation('Forum');
        NavigationUtil.clickCategory('Announcements');
        expect(ForumPage.getClosedElement(0).isPresent()).toBeFalsy();
        NavigationUtil.clickThread('VX Ongoing!');

        NavigationUtil.clickTab('Toggle Tools');
        NavigationUtil.clickFixedTools('Thread Tools');
        NavigationUtil.clickFixedTools('Close Thread');

        NavigationUtil.clickNavigation('Forum');
        NavigationUtil.clickCategory('Announcements');
        expect(ForumPage.getClosedElement(0).isPresent()).toBeTruthy();
        NavigationUtil.clickThread('VX Ongoing!');

        NavigationUtil.clickTab('Toggle Tools');
        NavigationUtil.clickFixedTools('Thread Tools');
        NavigationUtil.clickFixedTools('Open Thread');

        NavigationUtil.clickNavigation('Forum');
        NavigationUtil.clickCategory('Announcements');
        expect(ForumPage.getClosedElement(0).isPresent()).toBeFalsy();
    });

    it('should be possible to post in a thread', () => {
        NavigationUtil.clickNavigation('Forum');
        NavigationUtil.clickCategory('Announcements');
        NavigationUtil.clickThread('VX Ongoing!');

        InputUtil.fillEditor(ThreadPage.getPostEditor(), 'VX is fun to work on!');
        browser.executeScript('window.scrollTo(0, document.body.scrollHeight)');
        browser.sleep(3000);
        NavigationUtil.clickTab('Post', 'app-editor');

        CommonUtil.open('/forum');

        ForumPage.verifyLatestPost('VX Ongoing!', 0);
    });

    it('should be possible to sticky and unsticky a thread', () => {
        NavigationUtil.clickNavigation('Forum');
        NavigationUtil.clickCategory('Announcements');
        expect(ForumPage.getStickyElement(0).isPresent()).toBeFalsy();
        NavigationUtil.clickThread('VX Ongoing!');

        NavigationUtil.clickTab('Toggle Tools');
        NavigationUtil.clickFixedTools('Thread Tools');
        NavigationUtil.clickFixedTools('Sticky');

        NavigationUtil.clickNavigation('Forum');
        NavigationUtil.clickCategory('Announcements');
        expect(ForumPage.getStickyElement(0).isPresent()).toBeTruthy();
        NavigationUtil.clickThread('VX Ongoing!');

        NavigationUtil.clickTab('Toggle Tools');
        NavigationUtil.clickFixedTools('Thread Tools');
        NavigationUtil.clickFixedTools('Unsticky');

        NavigationUtil.clickNavigation('Forum');
        NavigationUtil.clickCategory('Announcements');
        expect(ForumPage.getStickyElement(0).isPresent()).toBeFalsy();
    });

    it('should be possible to change owner of a thread', () => {
        NavigationUtil.clickNavigation('Forum');
        NavigationUtil.clickCategory('Announcements');
        NavigationUtil.clickThread('VX Ongoing!');
        expect(ThreadPage.getPostOwner(0).getText()).toEqual('Tovven');

        NavigationUtil.clickTab('Toggle Tools');
        NavigationUtil.clickFixedTools('Thread Tools');
        NavigationUtil.clickFixedTools('Change Owner');

        InputUtil.fillInput(ThreadPage.getChangeOwnerInput(), 'test');
        NavigationUtil.clickButton('Done');

        expect(ThreadPage.getPostOwner(0).getText()).toEqual('test');
    });

    it('should be possible to delete a thread', () => {
        NavigationUtil.clickNavigation('Forum');
        NavigationUtil.clickCategory('Announcements');
        NavigationUtil.clickThread('VX Ongoing!');

        NavigationUtil.clickTab('Toggle Tools');
        NavigationUtil.clickFixedTools('Thread Tools');
        NavigationUtil.clickFixedTools('Delete Thread');
        NavigationUtil.clickButton('Yes');

        NavigationUtil.clickNavigation('Forum');
        NavigationUtil.clickCategory('Announcements');
        expect(ForumPage.getThreadElement('VX Ongoing!').isPresent()).toBeFalsy();
    });
});
