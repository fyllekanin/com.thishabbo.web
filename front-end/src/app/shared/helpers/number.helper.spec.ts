import { NumberHelper } from 'shared/helpers/number.helper';

describe('NumberHelper', () => {

    describe('random', () => {
        it('#1 should return a random number between the min and max', () => {
            // When
            const result = NumberHelper.random(1, 5);

            // Then
            expect(result < 1).toBeFalsy();
            expect(result > 5).toBeFalsy();
        });

        it('#2 should return a random number between the min and max', () => {
            // When
            const result = NumberHelper.random(50, 100);

            // Then
            expect(result < 50).toBeFalsy();
            expect(result > 100).toBeFalsy();
        });
    });
});
