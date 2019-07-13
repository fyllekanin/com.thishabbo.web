import { AppLoadService } from 'core/loader/app-load.service';
import { init_app } from './app.module';

describe('AppModule', () => {

    it('init_app should call on initializeApp on AppLoadService', () => {
        // Given
        const appLoadService = new AppLoadService(null);
        spyOn(appLoadService, 'initializeApp').and.callFake(() => {
            return new Promise(res => res());
        });

        // When
        init_app(appLoadService)();

        // Then
        expect(appLoadService.initializeApp).toHaveBeenCalled();
    });
});
