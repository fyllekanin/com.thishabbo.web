import { AfterViewInit, Component, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';
import { exampleData, TreeDiagram, TreeDiagramSize } from 'shared/components/graph/tree-diagram/tree-diagram.model';

@Component({
    selector: 'app-tree-diagram',
    templateUrl: 'tree-diagram.component.html',
    styleUrls: ['tree-diagram.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class TreeDiagramComponent implements AfterViewInit {
    private _data = exampleData;
    private _duration = 750;
    private _size: TreeDiagramSize = {
        height: 0,
        width: 0,
        top: 20,
        left: 90,
        right: 0,
        bottom: 0
    };

    private _svg;
    private _zoom;
    private _tree;
    private _root;
    private _index = 0;

    @ViewChild('container') container;

    ngAfterViewInit () {
        this._size.width = 960 - this._size.left - this._size.right;
        this._size.height = 500 - this._size.top - this._size.bottom;

        this.setZoom();
        this.setSvgAttributes();
        this._tree = d3.tree().size([this._size.height, this._size.width]);

        if (this._data) {
            this.updateTree();
        }
    }

    @Input()
    set data (data: TreeDiagram) {
        this._data = data;
        if (this._svg && this._data) {
            this.updateTree();
        }
    }

    private updateTree (): void {
        this._index = 0;
        this._root = d3.hierarchy(this._data, d => d.children) as any;
        this._root.x0 = this._size.height / 2;
        this._root.y0 = 0;
        (this._root.children || []).forEach(this.collapse.bind(this));
        this.update(this._root);
    }

    private update (source): void {
        const treeData = this._tree(this._root);
        const nodes = treeData.descendants();
        const links = treeData.descendants().slice(1);
        nodes.forEach(d => d.y = d.depth * 180);

        const node = this._svg.selectAll('g.node')
            .data(nodes, d => d.id || (d.id = ++this._index));

        const nodeEnter = node.enter().append('g')
            .attr('class', 'node')
            .attr('transform', () => `translate(${source.y0},${source.x0})`)
            .on('click', this.click.bind(this));

        nodeEnter.append('circle')
            .attr('class', 'node')
            .attr('r', 1e-6)
            .style('fill', d => d._children ? 'lightsteelblue' : '#fff');

        nodeEnter.append('text')
            .attr('dy', '.35em')
            .attr('x', d => d.children || d._children ? -13 : 13)
            .attr('text-anchor', d => d.children || d._children ? 'end' : 'start')
            .text(d => d.data.name);

        const nodeUpdate = nodeEnter.merge(node);
        nodeUpdate.transition()
            .duration(this._duration)
            .attr('transform', d => `translate(${d.y},${d.x})`);

        nodeUpdate.select('circle.node')
            .attr('r', 10)
            .style('fill', d => d._children ? 'lightsteelblue' : '#fff')
            .attr('cursor', 'pointer');

        const nodeExit = node.exit().transition()
            .duration(this._duration)
            .attr('transform', () => `translate(${source.y}, ${source.x})`)
            .remove();

        nodeExit.select('circle')
            .attr('r', 1e-6);

        nodeExit.select('text')
            .style('fill-opacity', 1e-6);

        const link = this._svg.selectAll('path.link')
            .data(links, d => d.id);

        const linkEnter = link.enter().insert('path', 'g')
            .attr('class', 'link')
            .attr('d', () => {
                const o = {x: source.x0, y: source.y0};
                return this.diagonal(o, o);
            });

        const linkUpdate = linkEnter.merge(link);
        linkUpdate.transition()
            .duration(this._duration)
            .attr('d', d => this.diagonal(d, d.parent));

        link.exit().transition()
            .duration(this._duration)
            .attr('d', () => {
                const o = {x: source.x, y: source.y};
                return this.diagonal(o, o);
            })
            .remove();

        nodes.forEach(d => {
            d.x0 = d.x;
            d.y0 = d.y;
        });
    }

    private zoomed (): void {
        const x = d3.event.transform.x + this._size.left;
        const y = d3.event.transform.y + this._size.top;
        this._svg.attr('transform', `translate(${x},${y}) scale(1)`);
    }

    private setZoom (): void {
        this._zoom = d3.zoom()
            .extent([[this._size.left, this._size.top], [this._size.width, this._size.height]])
            .scaleExtent([1, 1])
            .on('zoom', this.zoomed.bind(this));
    }

    private setSvgAttributes (): void {
        this._svg = d3.select(this.container.nativeElement)
            .append('svg')
            .attr('width', this._size.width)
            .attr('height', this._size.height)
            .call(this._zoom)
            .append('g')
            .attr('class', 'containerG')
            .attr('transform', `translate(${this._size.left}, ${this._size.top})`);
    }

    private collapse (d): void {
        if (d.children) {
            d._children = d.children;
            d._children.forEach(this.collapse.bind(this));
            d.children = null;
        }
    }

    private diagonal (s, d): string {
        return `M ${s.y} ${s.x}
                C ${(s.y + d.y) / 2} ${s.x},
                  ${(s.y + d.y) / 2} ${d.x},
                  ${d.y} ${d.x}`;
    }

    private click (d): void {
        if (d.children) {
            d._children = d.children;
            d.children = null;
        } else {
            d.children = d._children;
            d._children = null;
        }
        this.update(d);
    }
}
