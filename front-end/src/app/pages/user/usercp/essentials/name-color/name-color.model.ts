import { ClassHelper, arrayOf, primitive } from 'shared/helpers/class.helper';
import { ShopItem } from 'app/pages/sitecp/sub-pages/shop/items/items.model';

export class NameColor {
    @primitive()
    iconId: number;
    @primitive()
    effectId: number;
    @arrayOf(ShopItem)
    availableNameIcons: Array<ShopItem> = [];
    @arrayOf(ShopItem)
    availableNameEffects: Array<ShopItem> = [];
    @arrayOf(String)
    colors: Array<string> = [];
    @primitive()
    canUpdateColor: boolean;

    constructor(source?: Partial<NameColor>) {
        ClassHelper.assign(this, source);
    }
}
