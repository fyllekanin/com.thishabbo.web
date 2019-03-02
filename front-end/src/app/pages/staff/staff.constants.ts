import { BreadcrumbItem } from 'core/services/breadcrum/breadcrum.model';

export const STAFFCP_BREADCRUM_ITEM = new BreadcrumbItem({
    title: 'StaffCP',
    url: '/staff'
});

export const STAFFCP_RADIO_BREADCRUM_ITEM = new BreadcrumbItem({
    title: 'Radio',
    url: '/staff/radio'
});

export const STAFFCP_RADIO_PERM_SHOW_BREADCRUM_ITEM = new BreadcrumbItem({
    title: 'Manage Permanent Shows',
    url: '/staff/radio/permanent-shows/page/1'
});

export const STAFFCP_EVENTS_BREADCRUM_ITEM = new BreadcrumbItem({
    title: 'Events',
    url: '/staff/events'
});

export const STAFFCP_MANAGEMENT_BREADCRUMB_ITEM = new BreadcrumbItem({
    title: 'Management',
    url: '/staff/management'
});
