import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { Person } from '../person';
import { FriendService } from './../friend.service';

@Component({
  selector: 'app-friends-graph',
  templateUrl: './friends-graph.component.html',
  styleUrls: ['./friends-graph.component.scss'],
})
export class FriendsGraphComponent implements OnInit {
  private height = 600;

  constructor(private friendService: FriendService) {}

  createSvg(): any {
    return d3
      .select('#friends-graph')
      .append('svg')
      .attr('width', d3.select('#friends-graph').style('width'))
      .attr('height', this.height);
  }

  renderGraph(data): void {
    // Ref: https://observablehq.com/@garciaguillermoa/force-directed-graph
    const width = parseInt(d3.select('#friends-graph').style('width'), 10);
    const height = this.height;

    const drag = (sim) => {
      function dragstarted(event): void {
        if (!event.active) {
          sim.alphaTarget(0.3).restart();
        }
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      }

      function dragged(event): void {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      }

      function dragended(event): void {
        if (!event.active) {
          sim.alphaTarget(0);
        }
        event.subject.fx = null;
        event.subject.fy = null;
      }

      return d3
        .drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended);
    };

    const links = data.links.map((d) => Object.create(d));
    const nodes = data.nodes.map((d) => Object.create(d));

    const svg = d3.select('svg');
    const simulation = d3
      .forceSimulation(nodes)
      .force(
        'link',
        d3
          .forceLink(links)
          .distance(100)
          .id((d: any) => d.id)
      )
      .force('charge', d3.forceManyBody())
      .force('center', d3.forceCenter(width / 2, height / 2));

    const link = svg
      .append('g')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke-width', (d: any) => Math.sqrt(d.value));

    const node = svg
      .append('g')
      .selectAll('.node')
      .data(nodes)
      .join('g')
      .attr('class', 'node')
      .call(drag(simulation));

    const circles = node
      .append('circle')
      .attr('r', (d: any) => {
        // radius is proportional to weight
        const weightToRadius = d3
          .scaleSqrt() // instead of scaleLinear()
          .domain([0, 1000])
          .range([2, 20]);
        return weightToRadius(d.weight);
      })
      .attr(
        'fill',
        (d: any) =>
          d3.schemeOranges[8][`${Math.min(Math.floor(d.age / 20), 7)}`]
      );
    circles.append('title').text((d: any) => d.id);

    node
      .append('text')
      .text((d: any) => d.id)
      .style('fill', '#000')
      .style('font-size', '12px')
      .attr('x', 15)
      .attr('y', 3);

    simulation.on('tick', () => {
      // links update as nodes move
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node.attr('transform', (d: any) => `translate(${d.x}, ${d.y})`);
    });
  }

  ngOnInit(): void {
    this.createSvg();
    this.friendService.getPersons().subscribe(
      (data) => this.renderGraph(this.restructure(data)),
      (err) => console.error(err)
    );
  }

  private restructure(data: Person[]): any {
    const nodes = data.map((person) => ({
      id: person.name,
      age: person.age,
      weight: person.weight,
    }));
    const edgeStrings: Set<string> = data.reduce((linkSet, curr) => {
      curr.friends.forEach((friendName) => {
        linkSet.add(
          [curr.name, friendName]
            .sort((a: string, b: string) => a.localeCompare(b))
            .join(';')
        );
      });
      return linkSet;
    }, new Set<string>());
    const links = [...edgeStrings].map((linkStrings) => {
      const [source, target] = linkStrings.split(';');
      return { source, target, value: 1 };
    });
    return { nodes, links };
  }
}
