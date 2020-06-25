import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DEFAULT_HEADERS, QueryParameters, REST_API } from 'core/services/http/http.model';

@Injectable()
export class HttpService {

    constructor (private _http: HttpClient) {
    }

    get (path: string, params?: QueryParameters, customHeaders?: { headers: HttpHeaders }): Observable<any> {
        const url = REST_API + path + HttpService.buildParameters(params);
        const headers = customHeaders || DEFAULT_HEADERS;
        return this._http.get<any>(url, headers);
    }

    post (path: string, body: any, params?: QueryParameters, customHeaders?: { headers: HttpHeaders }): Observable<any> {
        const url = REST_API + path + HttpService.buildParameters(params);
        const headers = customHeaders || DEFAULT_HEADERS;
        return this._http.post<any>(url, body, headers);
    }

    put (path: string, body?: any, params?: QueryParameters, customHeaders?: { headers: HttpHeaders }): Observable<any> {
        const url = REST_API + path + HttpService.buildParameters(params);
        const headers = customHeaders || DEFAULT_HEADERS;
        return this._http.put<any>(url, body, headers);
    }

    delete (path: string, params?: QueryParameters, customHeaders?: { headers: HttpHeaders }): Observable<any> {
        const url = REST_API + path + HttpService.buildParameters(params);
        const headers = customHeaders || DEFAULT_HEADERS;
        return this._http.delete<any>(url, headers);
    }

    static buildParameters (params: QueryParameters = {}): string {
        if (!params || Object.keys(params).length === 0) {
            return '';
        }

        return '?' + Object.keys(params)
            .filter(key => params[key] && params[key] !== 'null' && params[key] !== 'undefined')
            .map(key => `${key}=${encodeURI(params[key])}`)
            .join('&');
    }
}
