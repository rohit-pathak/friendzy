import { Component, OnInit } from '@angular/core';
import { Person } from './../person';


@Component({
  selector: 'app-person-list',
  templateUrl: './person-list.component.html',
  styleUrls: ['./person-list.component.scss'],
})
export class PersonListComponent implements OnInit {

  columnsToDisplay = ['name', 'age', 'weight'];
  expandedPerson: Person | null;

  persons: Person[] = [
    {name: 'Rohit', age: 30, weight: 162, friends: []},
    {name: 'Marcos', age: 43, weight: 155, friends: []},
    {name: 'Shreyans', age: 30, weight: 159, friends: []}
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
