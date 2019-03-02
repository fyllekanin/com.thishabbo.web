import { Component } from '@angular/core';
import { InnerDialogComponent } from 'shared/app-views/dialog/dialog.model';
import { ChildItem, MainItem } from 'shared/app-views/navigation/navigation.model';
import { IdHelper } from 'shared/helpers/id.helper';

@Component({
    selector: 'app-admin-navigation-add-item',
    templateUrl: 'add-item.component.html'
})
export class AddItemComponent extends InnerDialogComponent {
    isMainItem: boolean;
    data = {
        label: '',
        url: '',
        loginRequired: false,
        isOnMobile: false,
        icon: '',
        isDivider: false
    };

    setData(isMainItem): void {
        this.isMainItem = isMainItem;
    }

    getData(): MainItem | ChildItem {
        if (this.data.isDivider) {
            return new ChildItem({ label: IdHelper.newUuid(), isDivider: true });
        }
        return this.isMainItem ? new MainItem(this.data) : new ChildItem(this.data);
    }
}
