import { arrayOf, ClassHelper, objectOf, primitive } from 'shared/helpers/class.helper';
import { SlimUser } from 'core/services/auth/auth.model';

export class VoucherCode {
    @primitive()
    voucherCodeId: number;
    @primitive()
    code: string;
    @primitive()
    note: string;
    @objectOf(SlimUser)
    claimer: SlimUser;
    @primitive()
    value: number;
    @primitive()
    createdAt: number;

    constructor(source: Partial<VoucherCode>) {
        ClassHelper.assign(this, source);
    }
}

export class VoucherCodesPage {
    @primitive()
    total: number;
    @primitive()
    page: number;
    @arrayOf(VoucherCode)
    items: Array<VoucherCode> = [];

    constructor(source: Partial<VoucherCodesPage>) {
        ClassHelper.assign(this, source);
    }
}
