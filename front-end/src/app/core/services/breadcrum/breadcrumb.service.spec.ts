import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';

describe('BreadcrumbService', () => {

    let service: BreadcrumbService;

    beforeEach(() => {
        service = new BreadcrumbService();
    });

    it('setting a breadcrumb should trigger on breadcrumb', done => {
        // Given
        service.onBreadcrumb.subscribe(res => {
            expect(res.current).toEqual('current');
            done();
        });

        // When
        service.breadcrumb = new Breadcrumb({ current: 'current' });
    });
});
