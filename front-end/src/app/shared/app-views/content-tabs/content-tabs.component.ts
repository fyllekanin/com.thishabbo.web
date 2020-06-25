import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ContentTab } from 'shared/app-views/content-tabs/content-tabs.model';

@Component({
    selector: 'app-content-tabs',
    templateUrl: 'content-tabs.component.html',
    styleUrls: [ 'content-tabs.component.css' ]
})
export class ContentTabsComponent {

    @Input() items: Array<ContentTab> = [];
    @Output() onItemClick = new EventEmitter<ContentTab>();

    onItemClicked (item: ContentTab): void {
        this.items.forEach(i => {
            i.isActive = i === item;
        });
        this.onItemClick.emit(item);
    }
}
