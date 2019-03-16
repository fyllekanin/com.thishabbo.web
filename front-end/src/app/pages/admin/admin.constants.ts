import { BreadcrumbItem } from 'core/services/breadcrum/breadcrum.model';

export const SITECP_BREADCRUMB_ITEM = new BreadcrumbItem({
    title: 'SiteCP',
    url: '/admin'
});

export const USER_LIST_BREADCRUMB_ITEM = new BreadcrumbItem({
    title: 'Manage Users',
    url: '/admin/users'
});

export const GROUP_LIST_BREADCRUMB_ITEM = new BreadcrumbItem({
    title: 'Manage Usergroups',
    url: '/admin/groups'
});

export const CATEGORY_LIST_BREADCRUMB_ITEM = new BreadcrumbItem({
    title: 'Manage Categories',
    url: '/admin/forum/categories/page/1'
});

export const BADGE_LIST_BREADCRUMB_ITEM = new BreadcrumbItem({
    title: 'Manage Badges',
    url: '/admin/badges'
});

export const BETTING_CATEGORIES_BREADCRUMB_ITEM = new BreadcrumbItem({
    title: 'Betting Categories',
    url: '/admin/betting/categories/page/1'
});

export const MANAGE_BBCODES_BREADCRUMB_ITEM = new BreadcrumbItem({
    title: 'Manage BBCode',
    url: '/admin/content/bbcodes'
});

export const POLL_LIST_BREADCRUMB_ITEM = new BreadcrumbItem({
    title: 'List Polls',
    url: '/admin/moderation/polls/page/1'
});

export const AUTO_BAN_LIST_BREADCRUMB_ITEM = new BreadcrumbItem({
    title: 'Automatic Bans List',
    url: '/admin/moderation/auto-bans/page/1'
});

export const WEBSITE_SETTINGS_BREADCRUMB_ITEM = new BreadcrumbItem({
    title: 'Website Settings',
    url: '/admin/website-settings'
});

export const SHOP_CATEGORIES_BREADCRUMB_ITEM = new BreadcrumbItem({
    title: 'Shop Categories List',
    url: '/admin/shop/categories/page/1'
});

export const SITE_MESSAGES_BREADCRUMB_ITEM = new BreadcrumbItem({
    title: 'Site Messages List',
    url: '/admin/website-settings/site-messages'
});

export const PAGES_BREADCRUMB_ITEM = new BreadcrumbItem({
    title: 'Pages List',
    url: '/admin/website-settings/pages'
});

export const THEMES_BREADCRUMB_ITEM = new BreadcrumbItem({
    title: 'Themes List',
    url: '/admin/website-settings/themes'
});
