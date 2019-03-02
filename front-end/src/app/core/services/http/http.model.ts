import { HttpHeaders } from '@angular/common/http';

export const REST_API = 'rest/api/';

export interface QueryParameters {
    [key: string]: string;
}

export const DEFAULT_HEADERS = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json'})
};
