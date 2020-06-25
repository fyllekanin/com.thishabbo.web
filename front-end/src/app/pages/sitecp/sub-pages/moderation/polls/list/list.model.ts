import { arrayOf, ClassHelper, primitive } from 'shared/helpers/class.helper';

export class PollListModel {
    @primitive()
    threadPollId: number;
    @primitive()
    thread: string;
    @primitive()
    question: string;
    @primitive()
    votes: number;
    @primitive()
    threadId: number;

    constructor (source: Partial<PollListModel>) {
        ClassHelper.assign(this, source);
    }
}

export class PollsListModel {
    @primitive()
    total: number;
    @primitive()
    page: number;
    @arrayOf(PollListModel)
    polls: Array<PollListModel> = [];

    constructor (source: Partial<PollsListModel>) {
        ClassHelper.assign(this, source);
    }
}

export enum PollsActions {
    VIEW,
    VIEW_THREAD,
    DELETE
}
