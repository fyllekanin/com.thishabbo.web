import { IdHelper } from 'shared/helpers/id.helper';

describe('IdHelper', () => {

    describe('newUuid', () => {
        it('should create a new uuid', () => {
            // Given
            const regexp = new RegExp(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/);

            // When
            const uuid = IdHelper.newUuid();

            // Then
            expect(uuid).toMatch(regexp);
        });
    });
});
