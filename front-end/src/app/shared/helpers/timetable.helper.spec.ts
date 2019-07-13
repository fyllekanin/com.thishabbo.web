import { TimetableModel } from 'shared/models/timetable.model';
import { TimetableHelper } from 'shared/helpers/timetable.helper';
import { EventType } from '../../pages/staff/sub-pages/events/types/types.model';

describe('TimetableHelper', () => {

    it('getSlot should find slot on correct day', () => {
        // Given
        const timetable = [
            new TimetableModel({timetableId: 1, day: 1, hour: 5}),
            new TimetableModel({timetableId: 2, day: 2, hour: 5})
        ];

        // When
        const slot = TimetableHelper.getSlot(timetable, 2, 5);

        // Then
        expect(slot.timetableId).toEqual(2);
    });

    describe('getEventName', () => {
        it('should return name from model if perm', () => {
            // Given
            const slot = new TimetableModel({
                isPerm: true,
                name: 'Slot Name'
            });

            // When
            const result = TimetableHelper.getEventName(slot, false);

            // Then
            expect(result).toEqual('Slot Name');
        });
        it('should return empty string if not perm and not events', () => {
            // Given
            const slot = new TimetableModel({
                isPerm: false,
                name: 'Slot Name'
            });

            // When
            const result = TimetableHelper.getEventName(slot, false);

            // Then
            expect(result).toEqual('');
        });
        it('should return event name if not perm', () => {
            // Given
            const slot = new TimetableModel({
                isPerm: false,
                event: new EventType({
                    name: 'event'
                })
            });

            // When
            const result = TimetableHelper.getEventName(slot, true);

            // Then
            expect(result).toEqual('event');
        });
        it('should return unknown if no event set', () => {
            // Given
            const slot = new TimetableModel({
                isPerm: false
            });

            // When
            const result = TimetableHelper.getEventName(slot, true);

            // Then
            expect(result).toEqual('unknown');
        });
    });
});
