import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { GlobalNotificationService } from 'core/services/notification/global-notification.service';
import { GlobalNotification } from 'shared/app-views/global-notification/global-notification.model';
import { EditorComponent } from 'shared/components/editor/editor.component';
import { EditorAction } from 'shared/components/editor/editor.model';
import { Page } from 'shared/page/page.model';
import { USERCP_BREADCRUM_ITEM } from '../../usercp.constants';
import { Signature } from './signature.model';
import { SignatureService } from '../services/signature.service';

@Component({
    selector: 'app-usercp-signature',
    templateUrl: 'signature.component.html'
})
export class SignatureComponent extends Page implements OnDestroy {
    private _signature = new Signature();

    @ViewChild('editor') editor: EditorComponent;

    saveButton: EditorAction = new EditorAction({ title: 'Save' });

    constructor(
        private _globalNotificationService: GlobalNotificationService,
        private _service: SignatureService,
        activatedRoute: ActivatedRoute,
        elementRef: ElementRef,
        breadcrumbService: BreadcrumbService
    ) {
        super(elementRef);
        this.addSubscription(activatedRoute.data, this.onData.bind(this));
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: 'Signature',
            items: [
                USERCP_BREADCRUM_ITEM
            ]
        });
    }

    ngOnDestroy(): void {
        super.destroy();
    }

    onSave(): void {
        this._service.save(this.editor.getEditorValue()).subscribe(res => {
            this._globalNotificationService.sendGlobalNotification(new GlobalNotification({
                title: 'Success',
                message: 'Signature updated'
            }));
            this.onData({ data: new Signature(res) });
        });
    }

    onKeyUp(content: string): void {
        this._service.parse(content).subscribe(parsed => {
            this._signature.parsedSignature = parsed;
        });
    }

    get signature(): string {
        return this._signature.signature;
    }

    get parsedSignature(): string {
        return this._signature.parsedSignature;
    }

    private onData(data: { data: Signature }): void {
        this._signature = data.data;
    }
}
