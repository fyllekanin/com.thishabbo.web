import { Router } from '@angular/router';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { TitleTopBorder } from 'shared/app-views/title/title.model';

@Component({
    selector: 'app-arcade-default',
    templateUrl: 'arcade-default.component.html',
    styleUrls: ['arcade-default.component.css']
})
export class ArcadeDefaultComponent extends Page implements OnDestroy {

    highscoreTop = TitleTopBorder.RED;

    constructor(
        private _router: Router,
        elementRef: ElementRef,
        breadcrumbService: BreadcrumbService
    ) {
        super(elementRef);
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: 'Arcade'
        });
    }

    ngOnDestroy(): void {
        super.destroy();
    }

    game(game: string): void {
        this._router.navigateByUrl(`/arcade/${game}`);
    }
}
