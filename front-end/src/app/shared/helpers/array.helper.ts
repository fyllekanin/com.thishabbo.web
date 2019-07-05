export class ArrayHelper {

    static copyArray (array: Array<any>): Array<any> {
        return JSON.parse(JSON.stringify(array));
    }

    static move (array: Array<any>, from, to): Array<any> {
        array.splice(to, 0, array.splice(from, 1)[0]);
        return array;
    }

    static sortByPropertyDesc (property: any, a, b): number {
        const propA = typeof a[property] === 'number' ? a[property] : String(a[property]).toLowerCase();
        const propB = typeof b[property] === 'number' ? b[property] : String(b[property]).toLowerCase();
        if (propA > propB) {
            return -1;
        } else if (propB > propA) {
            return 1;
        }
        return 0;
    }

    static sortByPropertyAsc (property: any, a, b): number {
        const propA = typeof a[property] === 'number' ? a[property] : String(a[property]).toLowerCase();
        const propB = typeof b[property] === 'number' ? b[property] : String(b[property]).toLowerCase();
        if (propA > propB) {
            return 1;
        } else if (propB > propA) {
            return -1;
        }
        return 0;
    }

    static flat (array: Array<any>, prefix = '', shouldAppend = true) {
        let result = [];
        array.forEach(item => {
            item.title = `${prefix} ${item.title}`;
            result.push(item);
            if (Array.isArray(item.children)) {
                result = result.concat(this.flat(item.children, shouldAppend ? `${prefix}--` : ''));
            }
        });
        return result;
    }
}
