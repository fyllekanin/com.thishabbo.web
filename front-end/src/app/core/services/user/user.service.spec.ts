import { UserService } from 'core/services/user/user.service';
import { TestBed } from '@angular/core/testing';

describe('UserService', () => {

    let service: UserService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                UserService
            ]
        });
        service = TestBed.inject(UserService);
    });

    it('should update subscribers when user is active/inactive', done => {
        // Given
        service.onUserActivityChange.subscribe(val => {
            expect(val).toBeTruthy();
            done();
        });

        // When
        service.isUserActive = true;
    });
});
