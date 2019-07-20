import { TableComponent } from 'shared/components/table/table.component';
import { TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Action, FilterConfig, TableAction, TableConfig, TableRow } from 'shared/components/table/table.model';
import { SafeHtmlModule } from 'shared/pipes/safe-html/safe-html.module';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

describe('TableComponent', () => {

    let component: TableComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                CommonModule,
                FormsModule,
                SafeHtmlModule,
                RouterTestingModule
            ],
            declarations: [
                TableComponent
            ],
            providers: [
                {
                    provide: Router, useValue: {
                        navigateByUrl: () => {
                        },
                        createUrlTree: () => {
                        }
                    }
                }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        });

        component = TestBed.createComponent(TableComponent).componentInstance;
    });

    it('tabClick should emit the value', () => {
        // Given
        spyOn(component.onTabClick, 'emit');

        // When
        component.tabClick(1);

        // Then
        expect(component.onTabClick.emit).toHaveBeenCalledWith(1);
    });

    it('onChange should emit the rowId and value from item', () => {
        // Given
        spyOn(component.onAction, 'emit');
        const row = new TableRow({id: 'test'});
        const item = {target: {value: 1}};


        // When
        component.onChange(row, item);

        // Then
        expect(component.onAction.emit).toHaveBeenCalledWith(new Action({
            rowId: 'test',
            value: 1
        }));
    });

    it('onFilterChange should build QueryParameters and emit them', () => {
        // Given
        spyOnProperty(component, 'filterConfigs', 'get').and.returnValue([
            new FilterConfig({key: 'test', value: 'apa'}),
            new FilterConfig({key: 'lipsum', value: 'rawr'})
        ]);
        spyOn(component.onFilter, 'emit');

        // When
        component.onFilterChange();

        // Then
        expect(component.onFilter.emit).toHaveBeenCalledWith({
            test: 'apa',
            lipsum: 'rawr'
        });
    });

    describe('haveActions', () => {
        it('should return false if no row have any actions', () => {
            // Given
            component.config = new TableConfig({
                rows: []
            });

            // When
            const result = component.haveActions;

            // Then
            expect(result).toBeFalsy();
        });
        it('should return true if any row have any actions', () => {
            // Given
            component.config = new TableConfig({
                rows: [
                    new TableRow({actions: []}),
                    new TableRow({actions: [new TableAction({})]})
                ]
            });

            // When
            const result = component.haveActions;

            // Then
            expect(result).toBeTruthy();
        });
    });
});
