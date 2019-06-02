import { primitiveOf } from 'shared/helpers/class.helper';

export class JobModel {
    @primitiveOf(String)
    habbo = '';
    @primitiveOf(String)
    discord = '';
    @primitiveOf(String)
    job = 'Not sure / not listed';
    @primitiveOf(String)
    country = '';
    @primitiveOf(String)
    content = '';
}
