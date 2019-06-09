import {Component, ElementRef, OnDestroy} from '@angular/core';
import {Page} from 'shared/page/page.model';
import {BreadcrumbService} from 'core/services/breadcrum/breadcrumb.service';
import {Breadcrumb} from 'core/services/breadcrum/breadcrum.model';

@Component({
    selector: 'app-custom-leader-board',
    templateUrl: 'leader-board.component.html',
    styleUrls: ['leader-board.component.css']
})
export class LeaderBoardComponent extends Page implements OnDestroy {

    constructor(
        elementRef: ElementRef,
        breadcrumbService: BreadcrumbService
    ) {
        super(elementRef);
        breadcrumbService.breadcrumb = new Breadcrumb({current: 'Leader board'});
    }

    ngOnDestroy() {
        super.destroy();
    }
}
