import { arrayOf, ClassHelper, primitive } from 'shared/helpers/class.helper';
import { IdHelper } from 'shared/helpers/id.helper';

export class ThreadAnswer {
    @primitive()
    id = IdHelper.newUuid();
    @primitive()
    label: string;
    @primitive()
    answers: number;

    constructor(source?: Partial<ThreadAnswer>) {
        ClassHelper.assign(this, source);
    }
}

export class ThreadPoll {
    @primitive()
    question: string;
    @arrayOf(ThreadAnswer)
    answers: Array<ThreadAnswer> = [];
    @primitive()
    haveVoted: boolean;
    @primitive()
    isNew: boolean;

    constructor(source: Partial<ThreadPoll>) {
        ClassHelper.assign(this, source);
    }
}
