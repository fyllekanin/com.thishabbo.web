export enum INFO_BOX_TYPE {
    WARNING = 'warning',
    INFO = 'info',
    ALERT = 'alert'
}

export interface InfoBoxModel {
    type: INFO_BOX_TYPE;
    title: string;
    content?: string;
    id?: any;
}
