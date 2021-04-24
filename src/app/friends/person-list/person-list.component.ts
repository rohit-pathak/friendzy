import { FriendService } from './../friend.service';
import { Component, OnInit } from '@angular/core';
import { Person } from './../person';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-person-list',
  templateUrl: './person-list.component.html',
  styleUrls: ['./person-list.component.scss'],
})
export class PersonListComponent implements OnInit {

  columnsToDisplay = ['name', 'age', 'weight'];
  expandedPerson: Person | null;

  persons: Observable<Person[]>;

  constructor(private friendService: FriendService) { }

  ngOnInit(): void {
    this.persons = this.friendService.getPersons();
    this.persons.subscribe(
      data => data,
      err => console.error(err)
    );
  }

}
