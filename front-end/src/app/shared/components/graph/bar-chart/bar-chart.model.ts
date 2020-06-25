import { arrayOf, ClassHelper, primitive } from 'shared/helpers/class.helper';

export interface BarChartSize {
    width: number;
    height: number;
    top: number;
    left: number;
    right: number;
    bottom: number;
}

export class BarChartItem {
    yItem: any;
    xItem: any;

    constructor (source: {
        yItem: any,
        xItem: any
    }) {
        ClassHelper.assign(this, source);
    }
}

export class BarChartModel {
    @primitive()
    yLabel: string;
    @primitive()
    xLabel: string;
    @arrayOf(BarChartItem)
    items: Array<BarChartItem> = [];

    constructor (source: {
        yLabel: string,
        xLabel: string,
        items: Array<BarChartItem>
    }) {
        ClassHelper.assign(this, source);
    }
}
