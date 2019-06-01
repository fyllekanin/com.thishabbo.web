import { primitiveOf } from 'shared/helpers/class.helper';

export class ContactModel {
    @primitiveOf(String)
    habbo = '';
    @primitiveOf(String)
    reason = 'Other';
    @primitiveOf(String)
    content = '';
}