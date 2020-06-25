import { NgModule } from '@angular/core';
import { HabboBadgeDirective } from './habbo-badge.directive';

@NgModule({
    declarations: [
        HabboBadgeDirective
    ],
    exports: [
        HabboBadgeDirective
    ]
})
export class HabboBadgeModule {
}
