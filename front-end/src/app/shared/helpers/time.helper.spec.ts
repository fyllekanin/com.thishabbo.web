import { TimeHelper } from 'shared/helpers/time.helper';

describe('TimeHelper', () => {
    const currentUnix = Math.round((new Date()).getTime() / 1000);

    describe('timeAgo', () => {
        const milestones = {
            day: 87400,
            hour: 3700,
            minute: 80,
            second: 1
        };

        it('should return full date if more then 3 days', () => {
            // Give
            const time = currentUnix - (milestones.day * 5);

            // When
            const result = TimeHelper.getTime(time);

            // Then
            const reg = new RegExp(/[0-9]+[a-zA-Z]+ [a-zA-Z]+ [0-9]+/);
            expect(result.match(reg)).toBeTruthy();
        });

        Object.keys(milestones).forEach(milestone => {
            it(`should return "1 ${milestone} ago" if above limix in unix seconds`, () => {
                // Given
                const time = currentUnix - milestones[milestone];

                // When
                const result = TimeHelper.getTime(time);

                // Then
                expect(result).toContain(milestone);
            });
        });

        Object.keys(milestones).forEach(milestone => {
            it(`should return "x ${milestone}s ago" if above limix in unix seconds`, () => {
                // Given
                const time = currentUnix - (milestones[milestone] * 3);

                // When
                const result = TimeHelper.getTime(time);

                // Then
                expect(result).toContain(`${milestone}s`);
            });
        });
    });

    describe('getTimeIncludingTimeOfDay', () => {
        it('should return correct AM time', () => {
            // Given
            const date = new Date(2018, 12, 11, 9, 23);

            // When
            const result = TimeHelper.getTimeIncludingTimeOfDay(date);

            // Then
            expect(result).toEqual('9:23 AM');
        });

        it('should return correct PM time', () => {
            // Given
            const date = new Date(2018, 12, 11, 19, 23);

            // When
            const result = TimeHelper.getTimeIncludingTimeOfDay(date);

            // Then
            expect(result).toEqual('7:23 PM');
        });
    });

    describe('getDayWithSuffix', () => {
        it('should return correct string for day 1', () => {
            // When
            const result = TimeHelper.getDayWithSuffix(1);

            // Then
            expect(result).toEqual('1st');
        });
        it('should return correct string for day 2', () => {
            // When
            const result = TimeHelper.getDayWithSuffix(2);

            // Then
            expect(result).toEqual('2nd');
        });
        it('should return correct string for day 3', () => {
            // When
            const result = TimeHelper.getDayWithSuffix(3);

            // Then
            expect(result).toEqual('3rd');
        });
        it('should return correct string for day 4', () => {
            // When
            const result = TimeHelper.getDayWithSuffix(4);

            // Then
            expect(result).toEqual('4th');
        });
    });

    it('getHours should return all available hours in a day', () => {
        // When
        const hours = TimeHelper.getHours();

        // Then
        expect(hours.length).toBe(24);
        expect(hours[0].number).toBe(0);
        expect(hours[23].number).toBe(23);
    });
});
