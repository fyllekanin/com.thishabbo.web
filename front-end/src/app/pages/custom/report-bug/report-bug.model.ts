import { primitiveOf } from 'shared/helpers/class.helper';

export class ReportBugModel {
    @primitiveOf(String)
    description = '';
    @primitiveOf(String)
    steps = '1. \n2. \n3. ';
    @primitiveOf(String)
    expected = '';
    @primitiveOf(String)
    actual = '';
    @primitiveOf(String)
    additional = '';
    @primitiveOf(String)
    screenshot = '';
}