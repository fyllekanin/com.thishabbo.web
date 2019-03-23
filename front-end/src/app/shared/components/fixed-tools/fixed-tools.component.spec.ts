import { FixedTools, FixedToolItem } from 'shared/components/fixed-tools/fixed-tools.model';
import { FixedToolsComponent } from 'shared/components/fixed-tools/fixed-tools.component';
import { TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('FixedToolsComponent', () => {

    let component: FixedToolsComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                CommonModule
            ],
            declarations: [
                FixedToolsComponent
            ],
            schemas: [ NO_ERRORS_SCHEMA ]
        });

        component = TestBed.createComponent(FixedToolsComponent).componentInstance;
    });

    describe('tools', () => {
        it('should set the tools provided', () => {
            // When
            component.tools = new FixedTools({ items: [
                new FixedToolItem({ id: '123' })
            ]});

            // Then
            expect(component.items.length).toEqual(1);
        });
        it('should set tools to empty FixedTools if null', () => {
            // When
            component.tools = null;

            // Then
            expect(component.items.length).toEqual(0);
        });
    });

    describe('onClick', () => {
        it('should emit value if item is not a BACK item or have children', (done) => {
            // Given
            const item = new FixedToolItem({ title: 'test', value: 1 });
            component.onAction.subscribe(value => {
                expect(value).toEqual(1);
                done();
            });

            // When
            component.onClick(item);
        });
        it('should set to parent if children exist', () => {
            // Given
            const item = new FixedToolItem({ title: 'parent', children: [
                new FixedToolItem({ title: 'test', value: 1 })
            ]});

            // When
            component.onClick(item);

            // Then
            expect(component.items[0].value).toEqual(1);
        });
        it('should go back to parent if value is "BACK"', () => {
            // Given
            const child = new FixedToolItem({ title: 'back', value: -1 });
            const parent = new FixedToolItem({ title: 'test', value: 1, children: [child]});
            component.tools = new FixedTools({ items: [parent] });
            component.onClick(parent);

            // When
            component.onClick(child);

            // Then
            expect(component.items[0].value).toEqual(1);
        });
    });

    describe('items', () => {
        let tools;
        beforeEach(() => {
            tools = new FixedTools({
                items: [
                    new FixedToolItem({
                        title: 'parent',
                        children: [
                            new FixedToolItem({ title: 'test', value: 1 })
                        ]
                    })
                ]
            });
        });
        it('should return the top level items if no current item set', () => {
            // Given
            component.tools = tools;

            // When
            const result = component.items;

            // Then
            expect(result[0].title).toEqual('parent');
        });
        it('should return children of current item and add BACK item', () => {
            // Given
            component.tools = tools;
            component.onClick(tools.items[0]);

            // When
            const result = component.items;

            // Then
            expect(result.map(item => item.value)).toEqual([1, -1]);
        });
    });
});
