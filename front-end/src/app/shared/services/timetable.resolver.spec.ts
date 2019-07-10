import { ActivatedRouteSnapshot } from '@angular/router';
import { HttpService } from 'core/services/http/http.service';
import { TimetableResolver } from 'shared/services/timetable.resolver';
import { TestBed } from '@angular/core/testing';

describe('TimetableResolver', () => {

    describe('resolve', () => {

        let service: TimetableResolver;

        beforeEach(() => {
            TestBed.configureTestingModule({
                providers: [
                    TimetableResolver,
                    {
                        provide: HttpService, useValue: {
                            get: () => {
                                return {
                                    pipe: () => {
                                    }
                                };
                            }
                        }
                    }
                ]
            });
            service = TestBed.get(TimetableResolver);
        });

        it('should apply the date "type" to the path with events', () => {
            // Given
            const httpService = TestBed.get(HttpService);
            const activatedRouteSnapshot = new ActivatedRouteSnapshot();
            activatedRouteSnapshot.data = {type: 'events'};
            spyOn(httpService, 'get').and.returnValue({
                pipe: () => {
                }
            });

            // When
            service.resolve(activatedRouteSnapshot);

            // Then
            expect(httpService.get).toHaveBeenCalledWith('events/timetable');
        });

        it('should apply the date "type" to the path with radio', () => {
            // Given
            const httpService = TestBed.get(HttpService);
            const activatedRouteSnapshot = new ActivatedRouteSnapshot();
            activatedRouteSnapshot.data = {type: 'radio'};
            spyOn(httpService, 'get').and.returnValue({
                pipe: () => {
                }
            });

            // When
            service.resolve(activatedRouteSnapshot);

            // Then
            expect(httpService.get).toHaveBeenCalledWith('radio/timetable');
        });
    });
});
