export class NumberHelper {

    static random (min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }

    static numberWithCommas (num: number): string {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
}
