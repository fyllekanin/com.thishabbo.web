export const SHOP_ITEM_TYPES = {
    badge: {label: 'Badge', value: 1},
    nameIcon: {label: 'Name Icon', value: 2},
    nameEffect: {label: 'Name Effect', value: 3},
    subscription: {label: 'Subscription', value: 4}
};

export const SHOP_ITEM_RARITIES = {
    common: {label: 'Common', value: 80, color: '#000000'},
    rare: {label: 'Rare', value: 50},
    epic: {label: 'Epic', value: 30},
    legendary: {label: 'Legendary', value: 10}
};

export const CONFIGURABLE_ITEMS = [
    SHOP_ITEM_TYPES.nameIcon,
    SHOP_ITEM_TYPES.nameEffect,
    SHOP_ITEM_TYPES.subscription
];

export const LOOT_BOXES = [
    {
        id: 1,
        asset: '/assets/images/shop/1.png'
    },
    {
        id: 2,
        asset: '/assets/images/shop/2.png'
    },
    {
        id: 3,
        asset: '/assets/images/shop/3.png'
    },
    {
        id: 4,
        asset: '/assets/images/shop/4.png'
    },
    {
        id: 5,
        asset: '/assets/images/shop/5.png'
    },
    {
        id: 6,
        asset: '/assets/images/shop/6.png'
    }
];
