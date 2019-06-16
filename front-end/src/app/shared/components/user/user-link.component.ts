import { Component, Input, ViewChild, ComponentFactoryResolver } from '@angular/core';
import { SlimUser } from 'core/services/auth/auth.model';
import { UserHelper } from 'shared/helpers/user.helper';
import { MiniProfileComponent } from './mini-profile/mini-profile.component';
import { MiniProfileDirective } from './mini-profile/mini-profile.directive';

@Component({
    selector: 'app-user-link',
    templateUrl: 'user-link.component.html',
    styleUrls: ['user-link.component.css']
})
export class UserLinkComponent {
    @Input() user = new SlimUser();
    @ViewChild(MiniProfileDirective, {static: true}) miniProfileHost: MiniProfileDirective;

    constructor(
        private componentFactoryResolver: ComponentFactoryResolver
    ) { }

    showMiniProfile(event: MouseEvent) {
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(MiniProfileComponent);
        const viewContainerRef = this.miniProfileHost.viewContainerRef;
        viewContainerRef.clear();

        const componentRef = viewContainerRef.createComponent(componentFactory);
        (<MiniProfileComponent>componentRef.instance).data = {
            user: this.user,
            left: event.pageX + 25,
            top: event.pageY - 90
        };
    }

    hideMiniProfile() {
        const viewContainerRef = this.miniProfileHost.viewContainerRef;
        viewContainerRef.clear();
    }

    get nameStyling (): string {
        return UserHelper.getNameColor(this.user.nameColor);
    }
}

