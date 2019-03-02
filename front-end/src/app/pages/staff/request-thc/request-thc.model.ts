import { primitive } from 'shared/helpers/class.helper';
import { IdHelper } from 'shared/helpers/id.helper';

export class RequestThcModel {
    @primitive()
    id = IdHelper.newUuid();
    @primitive()
    nickname: string;
    @primitive()
    habbo: string;
    @primitive()
    reason: string;
    @primitive()
    amount: number;
}

export enum RequestThcActions {
    SEND_REQUEST,
    ADD_ROW
}
