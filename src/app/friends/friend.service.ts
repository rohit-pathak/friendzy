import { Person } from './person';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FriendService {

  private dataStore = {
    persons: {} // an adj list representation of the friend graph
  };

  private subject: BehaviorSubject<Person[]> = new BehaviorSubject([]);

  constructor() { }

  getPersons(): Observable<Person[]> {
    return this.subject.asObservable();
  }

  getPersonsByName(...names: string[]): Observable<Person[]> {
    const nameSet = new Set(names);
    return of(
      Object.values(this.dataStore.persons)
      .filter(({name}) => nameSet.has(name)) as Person[]);
  }

  searchFriends(term: string): Observable<string[]> {
    if (!term){
      return of([]);
    }
    term = term.toLowerCase();
    return of(
      Object.keys(this.dataStore.persons)
      .filter(name => name.toLowerCase().includes(term))
    );
  }

  addOrUpdatePerson(person: Person): Observable<boolean> {
    const newEntry = {...person};
    this.dataStore.persons[person.name] = newEntry;

    // add this person as a friend for all their friends
    person.friends.forEach(friendName => {
      this.dataStore.persons[friendName].friends.push(person.name);
    });

    this.subject.next(Object.values(this.dataStore.persons) as Person[]);
    return of(true);
  }

}
