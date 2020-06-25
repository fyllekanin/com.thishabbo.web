import { TimetableResolver } from 'shared/services/timetable.resolver';
import { HttpService } from 'core/services/http/http.service';
import { ActivatedRouteSnapshot } from '@angular/router';
import { of } from 'rxjs';
import { TimetablePage } from 'shared/models/timetable.model';

describe('TimetableResolver', () => {

    let httpService: HttpService;
    let resolver: TimetableResolver;

    beforeEach(() => {
        httpService = <HttpService><unknown>{
            get: () => null
        };
        resolver = new TimetableResolver(httpService);
    });

    it('resolver should take the type from activatedRoute and map the result to page', done => {
        // Given
        const activatedRoute = <ActivatedRouteSnapshot><unknown>{
            data: {
                type: 'type'
            }
        };
        spyOn(httpService, 'get').and.returnValue(of({ timezones: [ 'timezone' ] }));

        // When
        resolver.resolve(activatedRoute).subscribe(result => {
            // Then
            expect(result instanceof TimetablePage).toBeTruthy();
            expect(result.timezones).toEqual([ 'timezone' ]);
            done();
        });
    });
});
