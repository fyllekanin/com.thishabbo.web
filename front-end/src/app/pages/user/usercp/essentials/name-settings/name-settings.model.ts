import { arrayOf, ClassHelper, primitive } from 'shared/helpers/class.helper';
import { ShopItem } from 'app/pages/sitecp/sub-pages/shop/items/items.model';

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
    canUpdateColor: boolean;

    constructor (source?: Partial<NameSettings>) {
        ClassHelper.assign(this, source);
    }
}
