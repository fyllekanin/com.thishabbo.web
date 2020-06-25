import { arrayOf, ClassHelper, objectOf, primitive } from 'shared/helpers/class.helper';
import { ShopItem } from 'app/pages/sitecp/sub-pages/shop/items/items.model';
import { SlimUser } from 'core/services/auth/auth.model';

export class NameSettings {
    @primitive()
    iconId: number;
    @primitive()
    effectId: number;
    @primitive()
    iconPosition: string;
    @arrayOf(ShopItem)
    availableNameIcons: Array<ShopItem> = [];
    @arrayOf(ShopItem)
    availableNameEffects: Array<ShopItem> = [];
    @arrayOf(String)
    colors: Array<string> = [];
    @primitive()
    canUpdateSettings: boolean;
    @objectOf(SlimUser)
    user: SlimUser;

    constructor (source?: Partial<NameSettings>) {
        ClassHelper.assign(this, source);
    }
}
