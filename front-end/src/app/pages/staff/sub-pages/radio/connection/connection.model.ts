import { ClassHelper, primitive } from 'shared/helpers/class.helper';

export class ConnectionModel {
    @primitive()
    ip: string;
    @primitive()
    port: number;
    @primitive()
    password: string;
    @primitive()
    sitecpPassword: string;
    @primitive()
    serverType: string;

    constructor(source?: Partial<ConnectionModel>) {
        ClassHelper.assign(this, source);
    }
}
