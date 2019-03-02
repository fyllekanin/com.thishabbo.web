import { Component } from '@angular/core';
import { ContinuesInformationService } from 'core/services/continues-information/continues-information.service';
import { InfoBoxModel } from 'shared/app-views/info-box/info-box.model';
import { LOCAL_STORAGE } from 'shared/constants/local-storage.constants';

@Component({
    selector: 'app-site-messages',
    templateUrl: 'site-messages.component.html',
    styleUrls: ['site-messages.component.css']
})
export class SiteMessagesComponent {

    siteMessages: Array<InfoBoxModel> = [];

    constructor(continuesInformationService: ContinuesInformationService) {
        continuesInformationService.onContinuesInformation.subscribe(information => {
            this.siteMessages = information.siteMessages
                .filter(item => !Boolean(localStorage.getItem(`${LOCAL_STORAGE.READ_SITE_MESSAGE}-${item.siteMessageId}`)))
                .map(item => {
                    return {
                        type: item.getType(),
                        title: item.title,
                        content: item.content,
                        id: item.siteMessageId
                    };
                });
        });
    }

    read(id: any): void {
        if (Boolean(localStorage.getItem(`${LOCAL_STORAGE.READ_SITE_MESSAGE}-${id}`))) {
            return;
        }
        localStorage.setItem(`${LOCAL_STORAGE.READ_SITE_MESSAGE}-${id}`, 'true');
        this.siteMessages = this.siteMessages.filter(item => Number(item.id) !== Number(id));
    }
}
