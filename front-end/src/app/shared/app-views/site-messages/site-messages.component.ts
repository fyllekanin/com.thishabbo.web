import { Component } from '@angular/core';
import { ContinuesInformationService } from 'core/services/continues-information/continues-information.service';
import { InfoBoxModel } from 'shared/app-views/info-box/info-box.model';
import { LOCAL_STORAGE } from 'shared/constants/local-storage.constants';

@Component({
    selector: 'app-site-messages',
    templateUrl: 'site-messages.component.html'
})
export class SiteMessagesComponent {
    siteMessages: Array<InfoBoxModel> = [];

    constructor (continuesInformationService: ContinuesInformationService) {
        continuesInformationService.onContinuesInformation.subscribe(information => {
            information.siteMessages
                .filter(item => this.siteMessages.findIndex(message => message.id === item.siteMessageId) === -1)
                .filter(item => !Boolean(localStorage.getItem(`${LOCAL_STORAGE.READ_SITE_MESSAGE}-${item.siteMessageId}`)))
                .forEach(item => {
                    this.siteMessages.push({
                        type: item.getType(),
                        title: item.title,
                        content: item.content,
                        id: item.siteMessageId
                    });
                });
        });
    }

    trackSiteMessages (_index: number, message: InfoBoxModel): number {
        return message.id;
    }

    read (id: any): void {
        if (Boolean(localStorage.getItem(`${LOCAL_STORAGE.READ_SITE_MESSAGE}-${id}`))) {
            return;
        }
        localStorage.setItem(`${LOCAL_STORAGE.READ_SITE_MESSAGE}-${id}`, 'true');
        this.siteMessages = this.siteMessages.filter(item => Number(item.id) !== Number(id));
    }
}
