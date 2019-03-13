import { Component } from '@angular/core';
import { InnerDialogComponent } from 'shared/app-views/dialog/dialog.model';
import { ChildItem, MainItem } from 'shared/app-views/navigation/navigation.model';
import { IdHelper } from 'shared/helpers/id.helper';

@Component({
    selector: 'app-admin-navigation-navigation-item',
    templateUrl: 'navigation-item.component.html'
})
export class NavigationItemComponent extends InnerDialogComponent {
    isMainItem: boolean;
    data = {
        id: IdHelper.newUuid(),
        label: '',
        url: '',
        loginRequired: false,
        isOnMobile: false,
        icon: '',
        isDivider: false,
        isHomePage: false
    };

    setData(data: { isMainItem: boolean, item: MainItem | ChildItem}): void {
        this.isMainItem = data.isMainItem;
        if (data.item) {
            this.data = {
                id: data.item.id,
                label: data.item.label,
                url: data.item.url,
                loginRequired: data.item.loginRequired,
                isOnMobile: data.item.isOnMobile,
                icon: data.item instanceof MainItem ? data.item.icon : '',
                isDivider: data.item instanceof ChildItem ? data.item.isDivider : false,
                isHomePage: data.item.isHomePage
            };
        }
    }

    getData(): MainItem | ChildItem {
        if (this.data.isDivider) {
            return new ChildItem({ label: IdHelper.newUuid(), isDivider: true });
        }
        return this.isMainItem ? new MainItem(this.data) : new ChildItem(this.data);
    }
}
