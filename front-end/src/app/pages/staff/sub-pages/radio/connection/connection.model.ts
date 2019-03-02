import { ClassHelper, primitive } from 'shared/helpers/class.helper';

export class ConnectionModel {
    @primitive()
    ip: string;
    @primitive()
    port: number;
    @primitive()
    password: string;
    @primitive()
    adminPassword: string;

    constructor(source?: Partial<ConnectionModel>) {
        ClassHelper.assign(this, source);
    }
}
