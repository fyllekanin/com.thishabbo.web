import { EditorComponent } from 'shared/components/editor/editor.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { LOCAL_STORAGE } from 'shared/constants/local-storage.constants';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpService } from 'core/services/http/http.service';

describe('Editor Component', () => {

    class FakeEditor {
        value =  '';
        destroy() {}
        bind() {}
        unbind() {}
        keyUp(_arg) {}
        sourceMode(_arg) {}
        val(arg) {
            if (arg) {
                this.value = arg;
            }
            return this.value;
        }
    }

    let component: EditorComponent;
    let fixture: ComponentFixture<EditorComponent>;
    let editor: FakeEditor;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule
            ],
            declarations: [
                EditorComponent
            ],
            providers: [
                HttpService
            ],
            schemas: [ NO_ERRORS_SCHEMA ]
        });

        editor = new FakeEditor();
        fixture = TestBed.createComponent(EditorComponent);
        component = fixture.componentInstance;
        component['_haveLoaded'] = true;
        spyOn(window['sceditor'], 'create').and.callFake(() => {});
        spyOn(window['sceditor'], 'instance').and.returnValue(editor);
    });

    describe('content', () => {
        it('should set the content string with the val method if instance is set', () => {
            // Given
            component.ngAfterViewInit();

            // When
            component.content = 'abc';

            // Then
            expect(component.getEditorValue()).toBe('abc');
        });
        it('should not throw if instance is not set', () => {
            // Given
            const meth = () => { component.content = 'abc'; };

            // Then
            expect(meth).not.toThrow();
        });
    });

    describe('getEditorValue', () => {
        it('should return set value if instance is created', () => {
            // Given
            component.content = 'test';
            component.ngAfterViewInit();

            // When
            const result = component.getEditorValue();

            // Then
            expect(result).toBe('test');
        });
        it('should return empty string if instance is not created', () => {
            // When
            const result = component.getEditorValue();

            // Then
            expect(result).toBe('');
        });
    });

    describe('setMode', () => {
        it('should set the source mode to false if localStorage value is not set', () => {
            // Given
            spyOn(editor, 'sourceMode');
            localStorage.removeItem(LOCAL_STORAGE.EDITOR_MODE);

            // When
            component.ngAfterViewInit();

            // Then
            expect(editor.sourceMode).toHaveBeenCalledWith(false);
        });
        it('should set the source mode to true if localStorage value is set', () => {
            // Given
            spyOn(editor, 'sourceMode');
            localStorage.setItem(LOCAL_STORAGE.EDITOR_MODE, 'true');

            // When
            component.ngAfterViewInit();

            // Then
            expect(editor.sourceMode).toHaveBeenCalledWith(true);
        });
    });
});
