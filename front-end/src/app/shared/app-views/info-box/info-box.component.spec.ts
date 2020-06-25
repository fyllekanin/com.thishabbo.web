import { InfoBoxComponent } from 'shared/app-views/info-box/info-box.component';
import { INFO_BOX_TYPE } from 'shared/app-views/info-box/info-box.model';

describe('InfoBoxComponent', () => {

    let component: InfoBoxComponent;

    beforeEach(() => {
        component = new InfoBoxComponent();
    });

    it('click should emit the model id', () => {
        // Given
        component.model = { type: INFO_BOX_TYPE.WARNING, title: 'title', id: 'id' };
        spyOn(component.onClick, 'emit');

        // When
        component.click();

        // Then
        expect(component.onClick.emit).toHaveBeenCalledWith('id');
    });

    describe('#title', () => {
        it('should return the title if model is set', () => {
            // Given
            component.model = { type: null, title: 'title' };

            // When
            const result = component.title;

            // Then
            expect(result).toBe('title');
        });
        it('should return empty string if model is not set', () => {
            // Given
            component.model = null;

            // When
            const result = component.title;

            // Then
            expect(result).toBe('');
        });
    });

    describe('#content', () => {
        it('should return the title if model is set', () => {
            // Given
            component.model = { type: null, title: 'title', content: 'content' };

            // When
            const result = component.content;

            // Then
            expect(result).toBe('content');
        });
        it('should return empty string if model is not set', () => {
            // Given
            component.model = null;

            // When
            const result = component.content;

            // Then
            expect(result).toBe('');
        });
    });

    describe('#model', () => {
        it('should check the type and set warning if applicable', () => {
            // When
            component.model = { type: INFO_BOX_TYPE.WARNING, title: 'title' };

            // Then
            expect(component.typClass).toEqual(INFO_BOX_TYPE.WARNING);
        });
        it('should check the type and set alert if applicable', () => {
            // When
            component.model = { type: INFO_BOX_TYPE.ALERT, title: 'title' };

            // Then
            expect(component.typClass).toEqual(INFO_BOX_TYPE.ALERT);
        });
        it('should check the type and set info if applicable', () => {
            // When
            component.model = { type: INFO_BOX_TYPE.INFO, title: 'title' };

            // Then
            expect(component.typClass).toEqual(INFO_BOX_TYPE.INFO);
        });
        it('should not throw if model is null', () => {
            expect(() => component.model = null).not.toThrow();
        });
    });
});
