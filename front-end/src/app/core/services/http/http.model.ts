import { HttpHeaders } from '@angular/common/http';

export const REST_API = 'api/';

export interface QueryParameters {
    [key: string]: any;
}

export const DEFAULT_HEADERS = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
