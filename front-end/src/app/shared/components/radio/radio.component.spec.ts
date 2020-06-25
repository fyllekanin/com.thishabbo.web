import { RadioComponent } from 'shared/components/radio/radio.component';
import { TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RadioService } from 'shared/components/radio/services/radio.service';
import { RadioModel } from 'shared/components/radio/radio.model';
import { SafeStyleModule } from 'shared/pipes/safe-style/safe-style.module';
import { ContinuesInformationService } from 'core/services/continues-information/continues-information.service';
import { SlimUser } from 'core/services/auth/auth.model';
import { NO_ERRORS_SCHEMA } from '@angular/core';

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
            schemas: [ NO_ERRORS_SCHEMA ],
            providers: [
                {
                    provide: RadioService, useValue: {
                        openRequest: () => null,
                        likeDj: () => null
                    }
                },
                {
                    provide: ContinuesInformationService, useValue: {
                        onDeviceSettingsUpdated: {
                            subscribe: () => null
                        },
                        onRadioPlayerToggle: {
                            subscribe: () => null
                        }
                    }
                }
            ]
        });

        component = TestBed.createComponent(RadioComponent).componentInstance;
    });

    it('openRequest should proxy to radio service', () => {
        // Given
        const radioService: RadioService = TestBed.inject(RadioService);
        spyOn(radioService, 'openRequest');

        // When
        component.openRequest();

        // Then
        expect(radioService.openRequest).toHaveBeenCalled();
    });

    it('likeDj should proxy to radio service', () => {
        // Given
        const radioService: RadioService = TestBed.inject(RadioService);
        spyOn(radioService, 'likeDj');

        // When
        component.likeDj();

        // Then
        expect(radioService.likeDj).toHaveBeenCalled();
    });

    describe('nickname', () => {
        it('should return the nickname if stats are set', () => {
            // Given
            component.stats = new RadioModel({
                currentDj: new SlimUser({ nickname: 'test' })
            });

            // When
            const result = component.currentDj.nickname;

            // Then
            expect(result).toEqual('test');
        });
        it('should return null when no stats are set', () => {
            // Given
            component.stats = null;

            // When
            const result = component.currentDj;

            // Then
            expect(result).toBeNull();
        });
    });

    describe('song', () => {
        it('should return the song if stats are set and radio is playing', () => {
            // Given
            component['_isPlaying'] = true;
            component.stats = new RadioModel({ song: 'test' });

            // When
            const result = component.song;

            // Then
            expect(result).toEqual('test');
        });
        it('should return string tell user to tune in if radio is not playing', () => {
            // Given
            component['_isPlaying'] = false;
            component.stats = new RadioModel({ song: 'test' });

            // When
            const result = component.song;

            // Then
            expect(result).toEqual('Tune in to see the song...');
        });
        it('should return "Tune in to see the song..." when no stats are set', () => {
            // Given
            component.stats = null;

            // When
            const result = component.song;

            // Then
            expect(result).toEqual('Tune in to see the song...');
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
