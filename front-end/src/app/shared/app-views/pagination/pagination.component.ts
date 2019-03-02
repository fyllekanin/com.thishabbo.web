import { PaginationModel, PaginationItem } from 'shared/app-views/pagination/pagination.model';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-pagination',
    templateUrl: 'pagination.component.html',
    styleUrls: ['pagination.component.css']
})
export class PaginationComponent {
    private _paginationModel: PaginationModel = new PaginationModel();

    constructor(private _router: Router) {}

    getUrl(item: PaginationItem): string {
        return this._paginationModel.url.replace(':page', item.value.toString());
    }

    goToPrevious(): void {
        const url = this.getUrl({ value: this._paginationModel.page - 1 });
        this._router.navigateByUrl(url);
    }

    goToNext(): void {
        const url = this.getUrl({ value: this._paginationModel.page + 1 });
        this._router.navigateByUrl(url);
    }

    @Input()
    set paginationModel(paginationModel: PaginationModel) {
        this._paginationModel = paginationModel || new PaginationModel();
    }

    get fillBackwardItems(): Array<PaginationItem> {
        if (this.thereIsGapBackwards()) {
            return [];
        }
        const items = [];
        for (let i = 1; i < this._paginationModel.page; i++) {
            if (i === this._paginationModel.page) {
                continue;
            }
            items.push({
                value: i,
                title: i.toString()
            });
        }
        return items;
    }

    get fillForwardItems(): Array<PaginationItem> {
        if (this.thereIsGapForward()) {
            return [];
        }
        const items = [];
        for (let i = this._paginationModel.page; i < this._paginationModel.total; i++) {
            items.push({
                value: i + 1,
                title: (i + 1).toString()
            });
        }
        return items;
    }

    get backwardItems(): Array<PaginationItem> {
        return this.thereIsGapBackwards() ? [
            { value: 1, title: '1' },
            { value: 2, title: '2' },
            { value: 3, title: '3' },
            { value: -1, title: '...' },
            { value: this._paginationModel.page - 1, title: (this._paginationModel.page - 1).toString() }
        ] : [];
    }

    get forwardItems(): Array<PaginationItem> {
        return this.thereIsGapForward() ? [
            { value: this._paginationModel.page + 1, title: (this._paginationModel.page + 1).toString() },
            { value: -1, title: '...' },
            { value: this._paginationModel.total - 2, title: (this._paginationModel.total - 2).toString() },
            { value: this._paginationModel.total - 1, title: (this._paginationModel.total - 1).toString() },
            { value: this._paginationModel.total, title: (this._paginationModel.total).toString() }
        ] : [];
    }

    get thereIsPrevious(): boolean {
        return this._paginationModel.page > 1;
    }

    get thereIsNext(): boolean {
        return this._paginationModel.page < this._paginationModel.total;
    }

    get currentPage(): string {
        return this._paginationModel.page.toString();
    }

    private thereIsGapBackwards(): boolean {
        return this._paginationModel.page > 4;
    }

    private thereIsGapForward(): boolean {
        return this._paginationModel.page < (this._paginationModel.total - 4);
    }
}
