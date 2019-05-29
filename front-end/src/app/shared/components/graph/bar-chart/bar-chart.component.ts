import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { BarChartModel, BarChartSize } from 'shared/components/graph/bar-chart/bar-chart.model';
import * as d3 from 'd3';

@Component({
    selector: 'app-graph-bar-chart',
    templateUrl: 'bar-chart.component.html',
    styleUrls: ['bar-chart.component.css']
})
export class BarChartComponent implements AfterViewInit {
    private _data: BarChartModel;
    private _size: BarChartSize = {
        height: 0,
        width: 0,
        top: 20,
        left: 50,
        right: 20,
        bottom: 30
    };

    private _svg;
    private _width;
    private _height;
    private _scaleLinear;
    private _scaleBand;

    @ViewChild('container', { static: true }) container;

    constructor(private _elementRef: ElementRef) {
    }

    ngAfterViewInit() {
        this._size.width = this._elementRef.nativeElement.offsetWidth;
        this._size.height = 500;
        this._svg = d3.select(this.container.nativeElement);
        this._svg.attr('width', this._size.width);
        this._svg.attr('height', this._size.height);
        if (this._data) {
            this.updateGraph();
        }
    }

    @Input()
    set data(data: BarChartModel) {
        this._data = data;
        if (this._svg) {
            this.updateGraph();
        }
    }


    private getWidthAndHeight(): void {
        this._width = +this._svg.attr('width') - this._size.left - this._size.right;
        this._height = +this._svg.attr('height') - this._size.top - this._size.bottom;
    }

    private setScales(): void {
        this._scaleBand = d3.scaleBand()
            .rangeRound([0, this._width])
            .padding(0.1);

        this._scaleBand.domain(this._data.items.map(function (d) {
            return d.xItem;
        }));

        this._scaleLinear = d3.scaleLinear()
            .rangeRound([this._height, 0]);

        this._scaleLinear.domain([0, d3.max(this._data.items, function (d) {
            return Number(d.yItem);
        })]);
    }

    private updateGraph(): void {
        this.getWidthAndHeight();
        this.setScales();

        this._svg.select('g').remove();
        const g = this._svg.append('g')
            .attr('transform', `translate(${this._size.left}, ${this._size.top})`);

        g.append('g')
            .attr('transform', `translate(0, ${this._height})`)
            .call(d3.axisBottom(this._scaleBand));

        g.append('g')
            .call(d3.axisLeft(this._scaleLinear))
            .append('text')
            .attr('fill', '#000')
            .attr('transform', 'rotate(-90)')
            .attr('y', 6)
            .attr('dy', '0.71em')
            .attr('text-anchor', 'end')
            .text(this._data.yLabel);

        g.selectAll('.bar')
            .data(this._data.items)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('x', item => {
                return this._scaleBand(item.xItem);
            })
            .attr('y', item => {
                return this._scaleLinear(Number(item.yItem));
            })
            .attr('width', this._scaleBand.bandwidth())
            .attr('height', item => {
                return this._height - this._scaleLinear(Number(item.yItem));
            });
    }
}
