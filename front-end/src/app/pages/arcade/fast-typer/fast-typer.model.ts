import { arrayOf, ClassHelper, objectOf, primitive, primitiveOf } from 'shared/helpers/class.helper';

export class CurrentWord {
    @primitive()
    word: string;
    @primitive()
    index: number;

    constructor (source: Partial<CurrentWord>) {
        ClassHelper.assign(this, source);
    }
}

export class FastTyperModel {
    @primitive()
    paragraph: string;
    @primitive()
    gameId: number;
    @primitive()
    paragraphId: number;
    @primitiveOf(Number)
    startTime = Math.round(new Date().getTime() / 1000);
    @primitive()
    endTime: number;

    @primitiveOf(Boolean)
    isGameRunning = false;
    @primitiveOf(Boolean)
    isCountDown = false;
    @arrayOf(String)
    words: Array<string> = [];
    @objectOf(CurrentWord)
    currentWord: CurrentWord;

    constructor (source?: Partial<FastTyperModel>) {
        ClassHelper.assign(this, source);
        this.words = this.paragraph ? this.paragraph.split(' ') : [];
        this.currentWord = new CurrentWord({
            word: this.firstWord,
            index: -1
        });
    }

    startCountDown (): void {
        this.isCountDown = true;
    }

    stopCountDown (): void {
        this.isCountDown = false;
    }

    startGame (): void {
        this.isGameRunning = true;
    }

    stopGame (): void {
        this.isGameRunning = false;
        this.endTime = Math.round(new Date().getTime() / 1000);
    }

    isLastWord (): boolean {
        return this.amountOfWords === (this.currentWord.index + 2);
    }

    nextWord (): void {
        this.currentWord = new CurrentWord({
            word: this.words[this.currentWord.index + 2],
            index: this.currentWord.index + 1
        });
    }

    get amountOfWords (): number {
        return this.words.length;
    }

    get firstWord (): string {
        return Array.isArray(this.words) && this.words.length > 0 ?
            this.words[0] : '';
    }
}
