import { ClassHelper, primitive } from 'shared/helpers/class.helper';

export class ConnectionModel {
    @primitive()
    ip: string;
    @primitive()
    port: number;
    @primitive()
    connectionPort: number;
    @primitive()
    mountPoint: string;
    @primitive()
    password: string;
    @primitive()
    adminPassword: string;
    @primitive()
    serverType: string;

    constructor (source?: Partial<ConnectionModel>) {
        ClassHelper.assign(this, source);
    }
}
