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
  private width = 600;
  private height = 600;

  constructor(private friendService: FriendService) {}

  createSvg(): any {
    return d3
      .select('#friends-graph')
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height);
  }

  renderGraph(data): void {
    console.log('rendering');
    const width = 600;
    const height = 600;

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
        d3.forceLink(links).id((d: any) => d.id)
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
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5)
      .selectAll('circle')
      .data(nodes)
      .join('circle')
      .attr('r', 5)
      .attr('fill', (d: any) => {
        const scale = d3.scaleOrdinal(d3.schemeCategory10);
        return scale(d.group);
      })
      .call(drag(simulation));

    node.append('title').text((d: any) => d.id);

    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node.attr('cx', (d: any) => d.x).attr('cy', (d: any) => d.y);
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
    console.log('nodes:', nodes);
    console.log('links', links);
    return { nodes, links };
  }
}
