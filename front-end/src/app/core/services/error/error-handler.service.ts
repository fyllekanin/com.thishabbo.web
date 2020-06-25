import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { HttpService } from 'core/services/http/http.service';

@Injectable()
export class ErrorHandlerService implements ErrorHandler {

    constructor (
        private _injector: Injector
    ) {
    }

    handleError (error: any): void {
        console.error(error);
        const httpService = this._injector.get(HttpService);
        httpService.post('error', {
            message: error.message,
            stack: error.stack
        }).subscribe(() => {
            // Empty
        });
    }
}
