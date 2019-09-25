import { primitiveOf } from 'shared/helpers/class.helper';

export class ReportBugModel {
    @primitiveOf(String)
    title = '';
    @primitiveOf(String)
    description = '';
    @primitiveOf(String)
    steps = '';
    @primitiveOf(String)
    expected = '';
    @primitiveOf(String)
    actual = '';
    @primitiveOf(String)
    additional = '';
    @primitiveOf(String)
    screenshot = '';
}
