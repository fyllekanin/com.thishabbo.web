import { RadioComponent } from 'shared/components/radio/radio.component';
import { TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RadioService } from 'shared/components/radio/services/radio.service';
import { RadioModel } from 'shared/components/radio/radio.model';
import { SafeStyleModule } from 'shared/pipes/safe-style/safe-style.module';

describe('RadioComponent', () => {

    let component: RadioComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                CommonModule,
                FormsModule,
                SafeStyleModule
            ],
            declarations: [
                RadioComponent
            ],
            providers: [
                { provide: RadioService, useValue: { openRequest: () => {}, likeDj: () => {} }}
            ]
        });

        component = TestBed.createComponent(RadioComponent).componentInstance;
    });

    it('openRequest should proxy to radio service', () => {
        // Given
        const radioService: RadioService = TestBed.get(RadioService);
        spyOn(radioService, 'openRequest');

        // When
        component.openRequest();

        // Then
        expect(radioService.openRequest).toHaveBeenCalled();
    });

    it('likeDj should proxy to radio service', () => {
        // Given
        const radioService: RadioService = TestBed.get(RadioService);
        spyOn(radioService, 'likeDj');

        // When
        component.likeDj();

        // Then
        expect(radioService.likeDj).toHaveBeenCalled();
    });

    describe('nickname', () => {
        it('should return the nickname if stats are set', () => {
            // Given
            component.stats = new RadioModel({ nickname: 'test' });

            // When
            const result = component.nickname;

            // Then
            expect(result).toEqual('test');
        });
        it('should return "Loading..." when no stats are set', () => {
            // Given
            component.stats = null;

            // When
            const result = component.nickname;

            // Then
            expect(result).toEqual('Loading...');
        });
    });

    describe('song', () => {
        it('should return the song if stats are set', () => {
            // Given
            component.stats = new RadioModel({ song: 'test' });

            // When
            const result = component.song;

            // Then
            expect(result).toEqual('test');
        });
        it('should return "Loading..." when no stats are set', () => {
            // Given
            component.stats = null;

            // When
            const result = component.song;

            // Then
            expect(result).toEqual('Loading...');
        });
    });

    describe('likes', () => {
        it('should return the likes if stats are set', () => {
            // Given
            component.stats = new RadioModel({ likes: 25 });

            // When
            const result = component.likes;

            // Then
            expect(result).toEqual(25);
        });
        it('should return 0 when no stats are set', () => {
            // Given
            component.stats = null;

            // When
            const result = component.likes;

            // Then
            expect(result).toEqual(0);
        });
    });

    describe('albumArt', () => {
        it('should return the the full URL if stats are set', () => {
            // Given
            component.stats = new RadioModel({ albumArt: 'http://test.com/test.gif' });

            // When
            const result = component.albumArt;

            // Then
            expect(result).toEqual('http://test.com/test.gif');
        });
        it('should return empty string when no stats are set', () => {
            // Given
            component.stats = null;

            // When
            const result = component.albumArt;

            // Then
            expect(result).toEqual('');
        });
    });
});
