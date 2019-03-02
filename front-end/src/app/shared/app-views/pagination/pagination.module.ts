import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from 'shared/app-views/pagination/pagination.component';
import { NgModule } from '@angular/core';

@NgModule({
    imports: [
        CommonModule,
        RouterModule
    ],
    declarations: [PaginationComponent],
    exports: [PaginationComponent]
})
export class PaginationModule {}
