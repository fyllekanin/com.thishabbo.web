import { arrayOf, ClassHelper, primitive } from 'shared/helpers/class.helper';

export class PollAnswerUser {
    @primitive()
    userId: number;
    @primitive()
    nickname: string;

    constructor (source: Partial<PollAnswerUser>) {
        ClassHelper.assign(this, source);
    }
}

export class PollAnswerModel {
    @primitive()
    answer: string;
    @arrayOf(PollAnswerUser)
    users: Array<PollAnswerUser> = [];

    constructor (source: Partial<PollAnswerModel>) {
        ClassHelper.assign(this, source);
    }
}

export class PollModel {
    @primitive()
    thread: string;
    @primitive()
    question: string;
    @arrayOf(PollAnswerModel)
    answers: Array<PollAnswerModel> = [];

    constructor (source: Partial<PollModel>) {
        ClassHelper.assign(this, source);
    }
}
