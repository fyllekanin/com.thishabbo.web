import { TimetableModel } from 'shared/models/timetable.model';
import { TimeHelper } from './time.helper';

export class TimetableHelper {

    static getSlot (timetable: Array<TimetableModel>, day: number, hour: number): TimetableModel {
        return timetable.filter(slot => slot.day === day)
            .find(slot => slot.hour === hour);
    }

    static mapBookingWithTime (item: TimetableModel): TimetableModel {
        const convertedHour = item.hour + TimeHelper.getTimeOffsetInHours();
        item.day = TimeHelper.getConvertedDay(convertedHour, item.day);
        item.hour = TimeHelper.getConvertedHour(convertedHour);
        return item;
    }

    static getEventName (timetable: TimetableModel, isEvents: boolean): string {
        if (!timetable.isPerm) {
            return isEvents ? `${timetable.event ? timetable.event.name : 'unknown'}` : '';
        }
        return `${timetable.name}`;
    }

    static isCurrentSlot (day: number, hour: number) {
        const date = new Date();
        if (date.getDay() !== day) {
            return false;
        }

        return hour === date.getHours();
    }
}
