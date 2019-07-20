import { IdHelper } from 'shared/helpers/id.helper';
import { arrayOf, ClassHelper, primitive, primitiveOf } from 'shared/helpers/class.helper';
import { TitleTopBorder } from 'shared/app-views/title/title.model';

export interface ColumnSize {
    column: string;
    actions?: string;
}

export class Action {
    @primitive()
    rowId: string;
    @primitive()
    value: number;

    constructor (source: Partial<Action>) {
        ClassHelper.assign(this, source);
    }
}

export class TableHeader {
    @primitive()
    title: string;
    @primitive()
    width: string;

    constructor (source: Partial<TableHeader>) {
        ClassHelper.assign(this, source);
    }
}

export class TableCell {
    @primitive()
    title: string;
    @primitive()
    statusBox: boolean;
    @primitive()
    status: boolean;
    @primitive()
    isEditable: boolean;
    @primitive()
    value: string;
    @primitive()
    innerHTML = false;

    constructor (source: Partial<TableCell>) {
        ClassHelper.assign(this, source);
    }
}

export class TableAction {
    @primitive()
    title: string;
    @primitive()
    value: number;
    @primitive()
    icon?: string;
    @primitive()
    isDisabled?: boolean;

    constructor (source: Partial<TableAction>) {
        ClassHelper.assign(this, source);
    }
}

export class TableRow {
    @primitive()
    id: string = IdHelper.newUuid();
    @arrayOf(TableCell)
    cells: Array<TableCell> = [];
    @arrayOf(TableAction)
    actions: Array<TableAction> = [];
    @primitive()
    actionsPlaceholder?: string;
    @primitive()
    isExpandable: boolean;

    @primitive()
    dataTitle: string;
    @primitive()
    data: string;

    @primitive()
    isOpen: boolean;
    @primitive()
    isSelected: boolean;

    constructor (source: Partial<TableRow>) {
        ClassHelper.assign(this, source);
    }
}

export enum FilterConfigType {
    TEXT,
    SELECT
}

export class FilterConfigItem {
    @primitive()
    label: string;
    @primitive()
    value: string;

    constructor (source: Partial<FilterConfigItem>) {
        ClassHelper.assign(this, source);
    }
}

export class FilterConfig {
    @primitive()
    title: string;
    @primitive()
    placeholder: string;
    @primitive()
    key: string;
    @primitive()
    value: string;
    @primitiveOf(Boolean)
    allOption = true;
    type: FilterConfigType = FilterConfigType.TEXT;
    items: Array<FilterConfigItem> = [];

    constructor (source: Partial<FilterConfig>) {
        ClassHelper.assign(this, source);
    }

    isSelect (): boolean {
        return this.type === FilterConfigType.SELECT;
    }

    get selectedValue (): FilterConfigItem {
        return this.items.find(item => item.value === this.value);
    }
}

export const FILTER_TYPE_CONFIG = new FilterConfig({
    title: 'Search Type',
    key: 'searchType',
    type: FilterConfigType.SELECT,
    value: 'partial',
    allOption: false,
    items: [
        new FilterConfigItem({label: 'Partial', value: 'partial'}),
        new FilterConfigItem({label: 'Exact', value: 'exact'}),
        new FilterConfigItem({label: 'From start', value: 'fromStart'})
    ]
});

export class TableConfig {
    @primitive()
    id?: number;
    @primitive()
    title: string;
    @primitiveOf(TitleTopBorder)
    topBorder: TitleTopBorder;
    @arrayOf(TableHeader)
    headers: Array<TableHeader> = [];
    @arrayOf(TableRow)
    rows: Array<TableRow> = [];
    @arrayOf(FilterConfig)
    filterConfigs: Array<FilterConfig> = [];
    @primitive()
    isSlim: boolean;
    @primitiveOf(Boolean)
    isRowsSelectable = false;
    @primitiveOf(Number)
    maxSelections = Number.MAX_SAFE_INTEGER;

    constructor (source: Partial<TableConfig>) {
        ClassHelper.assign(this, source);
    }
}
