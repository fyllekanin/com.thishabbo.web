import { NavigationUtil } from '../../utils/navigation.util';
import { CommonUtil } from '../../utils/common.util';
import { NewThreadPage } from '../../pages/new-thread.page';
import { InputUtil } from '../../utils/input.util';
import { UserCpPage } from '../../pages/user-cp.page';
import { ForumPage } from '../../pages/forum.page';
import { ThreadPage } from '../../pages/thread.page';
import { browser } from 'protractor';

describe('Fourm #1', () => {
    const USERNAME = 'tovven';
    const PASSWORD = 'test1234';

    beforeEach(() => {
        CommonUtil.open('/forum');
        NavigationUtil.clickUserNavigation('Logout');
        CommonUtil.login(USERNAME, PASSWORD);
    });

    it('should be possible to create a thread and be subscribed after', () => {
        NavigationUtil.clickNavigation('Forum');

        NavigationUtil.clickCategory('Dev News');
        NavigationUtil.clickTab('Create Thread');

        InputUtil.fillInput(NewThreadPage.getThreadTitleElement(), 'New Tests');
        InputUtil.fillEditor(NewThreadPage.getThreadEditor(), 'We are now having newly written E2E tests!');
        NavigationUtil.clickTab('Save');

        NavigationUtil.clickUserNavigation('UserCP');
        NavigationUtil.clickUserCpTool('Edit Thread Subscriptions');
        expect(UserCpPage.getThreadSubscription('New Tests').isPresent()).toBeTruthy();

        NavigationUtil.clickNavigation('Forum');
        NavigationUtil.clickCategory('Dev News');
        NavigationUtil.clickThread('New Tests');
        NavigationUtil.clickTab('Unsubscribe');

        NavigationUtil.clickUserNavigation('UserCP');
        NavigationUtil.clickUserCpTool('Edit Thread Subscriptions');
        expect(UserCpPage.getThreadSubscription('New Tests').isPresent()).toBeFalsy();
    });

    it('should be possible to open and close a thread', () => {
        NavigationUtil.clickNavigation('Forum');
        NavigationUtil.clickCategory('Announcements');
        expect(ForumPage.getClosedElement(0).isPresent()).toBeFalsy();
        NavigationUtil.clickThread('VX Ongoing!');

        NavigationUtil.clickTab('Toggle Tools');
        NavigationUtil.clickFixedTools('Thread tools');
        NavigationUtil.clickFixedTools('Close Thread');

        NavigationUtil.clickNavigation('Forum');
        NavigationUtil.clickCategory('Announcements');
        expect(ForumPage.getClosedElement(0).isPresent()).toBeTruthy();
        NavigationUtil.clickThread('VX Ongoing!');

        NavigationUtil.clickTab('Toggle Tools');
        NavigationUtil.clickFixedTools('Thread tools');
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
        browser.sleep(1000);
        browser.executeScript('window.scrollTo(0, document.body.scrollHeight)');
        NavigationUtil.clickButton('Post');

        CommonUtil.open('/forum');

        ForumPage.verifyLatestPost('New Tests', 0);
    });

    it('should be possible to sticky and unsticky a thread', () => {
        NavigationUtil.clickNavigation('Forum');
        NavigationUtil.clickCategory('Announcements');
        expect(ForumPage.getStickyElement(0).isPresent()).toBeFalsy();
        NavigationUtil.clickThread('VX Ongoing!');

        NavigationUtil.clickTab('Toggle Tools');
        NavigationUtil.clickFixedTools('Thread tools');
        NavigationUtil.clickFixedTools('Sticky');

        NavigationUtil.clickNavigation('Forum');
        NavigationUtil.clickCategory('Announcements');
        expect(ForumPage.getStickyElement(0).isPresent()).toBeTruthy();
        NavigationUtil.clickThread('VX Ongoing!');

        NavigationUtil.clickTab('Toggle Tools');
        NavigationUtil.clickFixedTools('Thread tools');
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
        NavigationUtil.clickFixedTools('Thread tools');
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
        NavigationUtil.clickFixedTools('Thread tools');
        NavigationUtil.clickFixedTools('Delete Thread');
        NavigationUtil.clickButton('Yes');

        NavigationUtil.clickNavigation('Forum');
        NavigationUtil.clickCategory('Announcements');
        expect(ForumPage.getThreadElement('VX Ongoing!').isPresent()).toBeFalsy();
    });
});
