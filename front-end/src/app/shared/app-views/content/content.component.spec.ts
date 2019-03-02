import { ContentComponent } from 'shared/app-views/content/content.component';
import { TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { TitleTopBorder } from 'shared/app-views/title/title.model';

describe('ContentComponent', () => {

    let component: ContentComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                CommonModule
            ],
            declarations: [
                ContentComponent
            ]
        });

        component = TestBed.createComponent(ContentComponent).componentInstance;
    });

    describe('top', () => {
        it('should set topBorder to the the input top', () => {
            // Given
            component.top = TitleTopBorder.BLUE;

            // Then
            expect(component.topBorder).toEqual(TitleTopBorder.BLUE);
        });
        it('should set topBorder to empty string if not valid input', () => {
            // Given
            component.top = null;

            // Then
            expect(component.topBorder).toEqual('');
        });
    });
});
