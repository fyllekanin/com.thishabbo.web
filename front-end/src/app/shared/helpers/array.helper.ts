
export class ArrayHelper {

    static copyArray (array: Array<any>): Array<any> {
        return JSON.parse(JSON.stringify(array));
    }

    static move(array: Array<any>, from, to): Array<any> {
        array.splice(to, 0, array.splice(from, 1)[0]);
        return array;
    }

    static sortByPropertyDesc(property: any, a, b): number {
        if (a[property] > b[property]) {
            return -1;
        } else if (b[property] > a[property]) {
            return 1;
        }
        return 0;
    }

    static sortByPropertyAsc(property: any, a, b): number {
        if (a[property] > b[property]) {
            return 1;
        } else if (b[property] > a[property]) {
            return -1;
        }
        return 0;
    }

    static flat(array: Array<any>, prefix = '', shouldAppend = true) {
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
