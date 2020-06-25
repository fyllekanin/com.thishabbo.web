export interface Day {
    label: string;
    abbr: string;
    number: number;
}

export interface Hour {
    label: string;
    number: number;
}

export class TimeHelper {
    static readonly ABBR_MONTHS = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ];
    static readonly FULL_MONTHS = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ];
    static readonly DAYS: Array<Day> = [
        { label: 'Monday', abbr: 'Mon', number: 1 },
        { label: 'Tuesday', abbr: 'Tue', number: 2 },
        { label: 'Wednesday', abbr: 'Wed', number: 3 },
        { label: 'Thursday', abbr: 'Thu', number: 4 },
        { label: 'Friday', abbr: 'Fri', number: 5 },
        { label: 'Saturday', abbr: 'Sat', number: 6 },
        { label: 'Sunday', abbr: 'Sun', number: 7 }
    ];

    static getDay (number: number): Day {
        return this.DAYS.find(day => day.number === number);
    }

    static getCurrentWeek (): number {
        const date = new Date();
        date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));
        const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
        // @ts-ignore
        return Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
    }

    static getStartOfWeek (): number {
        const date = new Date();
        const day = date.getDay();
        const diff = date.getDate() - day + (day === 0 ? -6 : 1);

        const mondayDate = new Date(date.setDate(diff));
        mondayDate.setHours(0, 0, 0, 0);
        return (mondayDate.getTime() / 1000) + (this.getTimeOffsetInHours() * 60 * 60);
    }

    static getDayWithSuffix (day: number): string {
        const j = day % 10,
            k = day % 100;
        if (j === 1 && k !== 11) {
            return day + 'st';
        }
        if (j === 2 && k !== 12) {
            return day + 'nd';
        }
        if (j === 3 && k !== 13) {
            return day + 'rd';
        }
        return day + 'th';
    }

    static getConvertedDay (convertedHour: number, day: number): number {
        if (convertedHour > 23) {
            return day === 7 ? 1 : day + 1;
        } else if (convertedHour < 0) {
            return day === 1 ? 7 : day - 1;
        }
        return day;
    }

    static getConvertedHour (convertedHour: number): number {
        if (convertedHour > 23) {
            return convertedHour - 24;
        } else if (convertedHour < 0) {
            return convertedHour + 24;
        }
        return convertedHour;
    }

    static getHourOffsetRounded (): number {
        const offset = new Date().getTimezoneOffset() / 60;
        return offset > 0 ? Math.floor(offset) : Math.round(offset);
    }

    static getTimeOffset (): number {
        const offset = new Date().getTimezoneOffset();
        return offset > 0 ? -offset : Math.abs(offset);
    }

    static getTimeOffsetInHours (): number {
        return Math.floor(this.getTimeOffset() / 60);
    }

    static getHours (): Array<Hour> {
        const hours: Array<Hour> = [];
        for (let i = 0; i < 24; i++) {
            hours.push({
                label: i === 0 ? '12:00 AM' : (i > 11 ? `${(i > 12 ? i - 12 : i)}:00 PM` : `${i}:00 AM`),
                number: i
            });
        }
        return hours;
    }

    /**
     * Get the long date string with time
     * Format: {day}th {month} {year} - {time} AM/PM
     *
     * @param time
     */
    static getLongDate (time: number): string {
        const date = new Date(time * 1000);
        if (date.getFullYear() === 1970) {
            return 'Never';
        }

        const day = date.getDate();
        const year = date.getFullYear();
        return `${TimeHelper.getDayWithSuffix(day)} ${this.ABBR_MONTHS[date.getMonth()]} ${year}`;
    }

    /**
     * Get the long date string with time
     * Format: {day}th {month} {year} - {time} AM/PM
     *
     * @param time
     */
    static getLongDateWithTime (time: number): string {
        const date = new Date(time * 1000);
        if (date.getFullYear() === 1970) {
            return 'Never';
        }

        const timeOfDay = this.getTimeIncludingTimeOfDay(date);
        return `${TimeHelper.getLongDate(time)} - ${timeOfDay}`;
    }

    /**
     * Get the hour and minutes of the day including AM/PM
     * @param date
     * @return {string}
     */
    static getTimeIncludingTimeOfDay (date: Date): string {
        const minutes = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
        let hour: number;
        if (date.getHours() < 12) {
            hour = date.getHours() === 0 ? 12 : date.getHours();
            return `${hour}:${minutes} AM`;
        }

        hour = date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
        return `${hour}:${minutes} PM`;
    }

    static toDateString (value: number): string {
        const date = value ? new Date(value * 1000) : new Date();
        const month = date.getMonth() + 1;
        return `${date.getFullYear()}-${month < 10 ? `0${month}` : month}-${date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()}`;
    }

    static getUntil (toDate: Date): string {
        const now = new Date();
        const difference = toDate.getTime() - now.getTime();

        const seconds = Math.floor(difference / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        return `${days > 0 ? days + ' days' : ''} ${hours % 24} hours ${minutes % 60} minutes ${seconds % 60} seconds`;
    }

    static getTime (time: number): string {
        const curr = new Date().getTime() / 1000;
        const seconds = curr - time;
        let interval = Math.floor(seconds / 86400);

        if (interval > 3) {
            return TimeHelper.getLongDateWithTime(time);
        }

        interval = Math.floor(seconds / 86400);
        if (interval >= 1) {
            return `${interval} day${interval > 1 ? 's' : ''} ago`;
        }

        interval = Math.floor(seconds / 3600);
        if (interval >= 1) {
            return `${interval} hour${interval > 1 ? 's' : ''} ago`;
        }

        interval = Math.floor(seconds / 60);
        if (interval >= 1) {
            return `${interval} minute${interval > 1 ? 's' : ''} ago`;
        }

        interval = Math.floor(seconds);
        return interval <= 0 ? 'now' : `${interval} second${interval > 1 ? 's' : ''} ago`;
    }
}
