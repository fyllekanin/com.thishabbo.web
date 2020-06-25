import { UserHelper } from 'shared/helpers/user.helper';

describe('UserHelper', () => {

    it('getYoutubeLink should append ID on embedded youtube link', () => {
        // Given
        const id = 'something';

        // When
        const url = UserHelper.getYoutubeLink(id);

        // Then
        expect(url).toEqual(`https://www.youtube.com/embed/${id}`);
    });
});
