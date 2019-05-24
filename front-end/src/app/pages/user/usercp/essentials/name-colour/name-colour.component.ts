import { TitleTab } from "shared/app-views/title/title.model";
import { Component, OnDestroy, ElementRef } from "@angular/core";
import { Page } from "shared/page/page.model";
import { NotificationService } from "core/services/notification/notification.service";
import { BreadcrumbService } from "core/services/breadcrum/breadcrumb.service";
import { Breadcrumb } from "core/services/breadcrum/breadcrum.model";
import { USERCP_BREADCRUM_ITEM } from "../../usercp.constants";
import { HttpClient } from "@angular/common/http";
import { NameColour } from "./name-colour.model";

@Component({
    selector: 'app-usercp-cover',
    templateUrl: 'cover-photo.component.html'
})
export class NameColourComponent extends Page implements OnDestroy {
    private _data: NameColour = new NameColour();

    tabs: Array<TitleTab> = [
        new TitleTab({ title: 'Save' })
    ];

    constructor(
        private _httpClient: HttpClient,
        private _notificationService: NotificationService,
        elementRef: ElementRef,
        breadcrumbService: BreadcrumbService
    ) {
        super(elementRef);
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: 'Name Colour',
            items: [
                USERCP_BREADCRUM_ITEM
            ]
        });
    }

    ngOnDestroy(): void {
        super.destroy();
    }

    onSave(): void {
        if(this.validate()) {
            this._httpClient.post('rest/api/usercp/name', {
                'colours': this._data.colours
            }).subscribe(() => {
                    this._notificationService.sendInfoNotification("Name Colour Updated");
                }, error => {
                    this._notificationService.sendErrorNotification(error.error.errors.comver[0]);
                });
        } else {
            this._notificationService.sendErrorNotification("Hex codes invalid");
        }

    }

    private validate () {
        let valid = true;
        const regex = /^#[0-9a-f]{3}(?:[0-9a-f]{3})?$/;
        this._data.colours.forEach(colour => {
            if (!regex.test(colour)) {
                valid = false;
            }
        })
        return valid;
    }

    get colours (): string {
        return this._data.colours.join(',');
    }

    set colours (colours: string) {
        this._data.colours = colours.split(',');
    }
}
