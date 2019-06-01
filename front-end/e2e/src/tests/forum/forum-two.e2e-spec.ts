import { NavigationUtil } from '../../utils/navigation.util';
import { CommonUtil } from '../../utils/common.util';
import { NewThreadPage } from '../../pages/new-thread.page';
import { InputUtil } from '../../utils/input.util';
import * as path from 'path';

describe('Forum #2', () => {
    const USERNAME = 'tovven';
    const PASSWORD = 'test1234';

    beforeEach(done => {
        CommonUtil.open('/home');
        CommonUtil.isLoggedIn().then(isLoggedIn => {
            if (isLoggedIn) {
                NavigationUtil.clickUserNavigation('Logout');
            }
            CommonUtil.login(USERNAME, PASSWORD);
            NavigationUtil.clickNavigation('Forum');
            done();
        });
    });

    it('should be possible to create and update a quest thread', () => {
        const thumbnailPath = path.resolve(__dirname, '../../resources/quest-thumbnail.gif');
        CommonUtil.open('/forum/category/6/page/1');
        NavigationUtil.clickTab('Create Thread');

        InputUtil.fillInput(NewThreadPage.getThreadTitleElement(), 'Quest Thread');
        NewThreadPage.getThumbnailElement().sendKeys(thumbnailPath);
        InputUtil.fillInput(NewThreadPage.getBadgeElement(), 'FR829');
        InputUtil.fillInput(NewThreadPage.getRoomLinkElement(), 'https://www.habbo.com/room/74928078');
        CommonUtil.clickCheckbox('Available');
        CommonUtil.clickCheckbox('Free');

        InputUtil.fillEditor(NewThreadPage.getThreadEditor(), 'This is a quest article! Now follow the guide and get the badge!');
        NavigationUtil.clickTab('Save');

        expect(NewThreadPage.getTag('Available').isPresent()).toBeTruthy();
        expect(NewThreadPage.getTag('Free').isPresent()).toBeTruthy();

        NavigationUtil.clickTab('Toggle Tools');
        NavigationUtil.clickFixedTools('Thread Tools');
        NavigationUtil.clickFixedTools('Edit Thread');

        expect(NewThreadPage.getThreadTitleElement().getAttribute('value')).toEqual('Quest Thread');
        expect(NewThreadPage.getBadgeElement().getAttribute('value')).toEqual('FR829');
        expect(NewThreadPage.getRoomLinkElement().getAttribute('value')).toEqual('https://www.habbo.com/room/74928078');
        CommonUtil.clickCheckbox('Free');

        NavigationUtil.clickTab('Save');
        NavigationUtil.clickTab('Back');

        expect(NewThreadPage.getTag('Available').isPresent()).toBeTruthy();
        expect(NewThreadPage.getTag('Free').isPresent()).toBeFalsy();
    });
});
