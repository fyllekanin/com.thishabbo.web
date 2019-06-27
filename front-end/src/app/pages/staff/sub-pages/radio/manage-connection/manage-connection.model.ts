import { ClassHelper, primitive } from 'shared/helpers/class.helper';

export class ManageConnectionModel {
    @primitive()
    ip: string;
    @primitive()
    port: number;
    @primitive()
    password: string;
    @primitive()
    adminPassword: string;
    @primitive()
    serverType: string;

    constructor(source?: Partial<ManageConnectionModel>) {
        ClassHelper.assign(this, source);
    }
}

export enum ManageConnectionActions {
    SAVE
}
