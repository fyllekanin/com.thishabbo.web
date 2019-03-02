import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { ConnectionModel } from './connection.model';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { STAFFCP_BREADCRUM_ITEM, STAFFCP_RADIO_BREADCRUM_ITEM } from '../../../staff.constants';
import { AuthService } from 'core/services/auth/auth.service';

@Component({
    selector: 'app-staff-radio-connection',
    templateUrl: 'connection.component.html'
})
export class ConnectionComponent extends Page implements OnDestroy {
    private _connectionModel: ConnectionModel = new ConnectionModel();

    constructor(
        private _authService: AuthService,
        elementRef: ElementRef,
        activatedRoute: ActivatedRoute,
        breadcrumbService: BreadcrumbService
    ) {
        super(elementRef);
        this.addSubscription(activatedRoute.data, this.onData.bind(this));
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: 'Connection information',
            items: [
                STAFFCP_BREADCRUM_ITEM,
                STAFFCP_RADIO_BREADCRUM_ITEM
            ]
        });
    }

    ngOnDestroy(): void {
        super.destroy();
    }

    get port(): number {
        return this._connectionModel.port;
    }

    get ip(): string {
        return this._connectionModel.ip;
    }

    get password(): string {
        return this._connectionModel.password;
    }

    get nickname(): string {
        return this._authService.authUser.nickname;
    }

    private onData(data: { data: ConnectionModel }): void {
        this._connectionModel = data.data;
    }
}
