import { TestBed } from '@angular/core/testing';
import { NoticeComponent } from 'shared/components/notice/notice.component';
import { Notice } from 'shared/components/notice/notice.model';

describe('NoticeComponent', () => {

    let component: NoticeComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            declarations: [
                NoticeComponent
            ]
        });

        component = TestBed.createComponent(NoticeComponent).componentInstance;
    });

    describe('notice', () => {
        it('Should set a new instance of a Notice if null', () => {
            // Given
            const notice = null;

            // When
            component.notice = notice;

            // Then
            expect(component.title).toBe(undefined);
            expect(component.text).toBe(undefined);
        });
        it('should set the backgroundColor on Host from notice value', () => {
            // Given
            const notice = new Notice({ backgroundColor: '#000000' });

            // When
            component.notice = notice;

            // Then
            expect(component.backgroundColor).toEqual('#000000');
        });

        describe('backgroundImage', () => {
            it('should set the background image to provided value in notice if set', () => {
                // Given
                const notice = new Notice({ backgroundImage: 'test' });

                // When
                component.notice = notice;

                // Then
                expect(component.backgroundImage).toEqual('url(test)');
            });
            it('should set backgroundImage to resource image with noticeId if backgroundImage not set', () => {
                // Given
                const notice = new Notice({ noticeId: 2 });

                // When
                component.notice = notice;

                // Then
                expect(component.backgroundImage).toContain('2.gif');
            });
        });
    });
});
