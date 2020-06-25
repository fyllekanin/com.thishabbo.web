import { ClassHelper, primitive, primitiveOf } from 'shared/helpers/class.helper';

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
    connectionPort: number;
    @primitiveOf(String)
    mountPoint = '';
    @primitive()
    serverType: string;
    @primitiveOf(String)
    azuracastApiKey = '';
    @primitiveOf(Number)
    azuracastStationId = 0;
    @primitiveOf(Boolean)
    isAzuracast = false;

    constructor (source?: Partial<ManageConnectionModel>) {
        ClassHelper.assign(this, source);
    }
}

export enum ManageConnectionActions {
    SAVE
}
