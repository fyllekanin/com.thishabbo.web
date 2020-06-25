import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { NotificationService } from 'core/services/notification/notification.service';
import { NotificationMessage } from 'shared/app-views/global-notification/global-notification.model';
import { EditorComponent } from 'shared/components/editor/editor.component';
import { EditorAction } from 'shared/components/editor/editor.model';
import { Page } from 'shared/page/page.model';
import { USERCP_BREADCRUM_ITEM } from '../../usercp.constants';
import { Signature, SignatureActions } from './signature.model';
import { SignatureService } from '../services/signature.service';

@Component({
    selector: 'app-usercp-signature',
    templateUrl: 'signature.component.html'
})
export class SignatureComponent extends Page implements OnDestroy {
    private _signature = new Signature();

    @ViewChild('editor', { static: true }) editor: EditorComponent;

    tabs: Array<EditorAction> = [
        new EditorAction({ title: 'Save', value: SignatureActions.SAVE }),
        new EditorAction({ title: 'Preview', value: SignatureActions.PREVIEW })
    ];
    preview = '<em>Nothing to preview...</em>';

    constructor (
        private _notificationService: NotificationService,
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

    ngOnDestroy (): void {
        super.destroy();
    }

    onAction (action: EditorAction): void {
        switch (action.value) {
            case SignatureActions.SAVE:
                this.onSave();
                break;
            case SignatureActions.PREVIEW:
                this.onPreview();
                break;
        }
    }

    onSave (): void {
        this._service.save(this.editor.getEditorValue()).subscribe(res => {
            this._notificationService.sendNotification(new NotificationMessage({
                title: 'Success',
                message: 'Signature updated'
            }));
            this.onData({ data: new Signature(res) });
        });
    }

    get signature (): string {
        return this._signature.signature;
    }

    private onData (data: { data: Signature }): void {
        this._signature = data.data;
    }

    private onPreview (): void {
        this.preview = '<em>Loading...</em>';
        this._service.parse(this.editor.getEditorValue())
            .subscribe(parsed => this.preview = parsed);
    }

}
