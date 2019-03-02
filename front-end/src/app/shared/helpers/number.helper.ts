
export class NumberHelper {

    static random(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }
}
