
export class StringHelper {

    static firstCharUpperCase(str: string): string {
        return str ? str.charAt(0).toUpperCase() + str.substring(1).toLowerCase() : '';
    }

    static prettifyString(str: string): string {
        return this.firstCharUpperCase(str.replace(new RegExp('_', 'g'), ' '));
    }
}
