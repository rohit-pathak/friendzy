import { Person } from './person';
import { Injectable } from '@angular/core';
import { Observable, of, from, throwError } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { Dexie } from 'dexie';

class FriendzyDatabase extends Dexie {
  persons: Dexie.Table<Person, string>; // string = type of the primkey

  constructor() {
    super('FriendzyDatabase');
    this.version(1).stores({
      persons: 'name', // name is the primary key
    });
  }
}

@Injectable({
  providedIn: 'root',
})
export class FriendService {
  private persons: { [personName: string]: Person }; // an adjacency list representation of the friend graph;
  private db: FriendzyDatabase;

  private subject: BehaviorSubject<Person[]> = new BehaviorSubject([]);

  constructor() {
    this.db = new FriendzyDatabase();
    from(this.db.persons.toArray()).subscribe((data) => {
      // create initial graph
      this.persons = data.reduce((a, c) => {
        a[c.name] = c;
        return a;
      }, {});
      this.subject.next(data); // emit the initial collection
    });
  }

  getPersons(): Observable<Person[]> {
    return this.subject.asObservable();
  }

  getPersonsByName(...names: string[]): Observable<Person[]> {
    const nameSet = new Set(names);
    return of(
      Object.values(this.persons).filter(({ name }) =>
        nameSet.has(name)
      ) as Person[]
    );
  }

  searchFriends(term: string): Observable<string[]> {
    if (!term) {
      return of([]);
    }
    term = term.toLowerCase();
    return of(
      Object.keys(this.persons).filter((name) =>
        name.toLowerCase().includes(term)
      )
    );
  }

  addPerson(person: Person): Observable<string> {
    if (person.name in this.persons) {
      return throwError(
        new Error(`A person with name ${person.name} already exists`)
      );
    }
    person = { ...person }; // make a copy
    return from(this.db.persons.add(person)).pipe(
      mergeMap(() => {
        // add new person to in-memory store
        this.persons[person.name] = person;
        // add this person as a friend for all their friends
        person.friends.forEach((friendName) => {
          this.persons[friendName].friends.push(person.name);
        });
        // update the db for the person's friends
        const updates: Person[] = person.friends.map((f) => ({
          ...this.persons[f],
        }));
        return from(this.db.persons.bulkPut(updates));
      }),
      mergeMap(() => {
        // emit new state
        this.subject.next(Object.values(this.persons));
        return of(person.name);
      })
    );
  }

  removePerson(person: Person): Observable<string> {
    if (!(person.name in this.persons)) {
      return throwError(new Error(`No person with name ${person.name} exists`));
    }
    return from(this.db.persons.delete(person.name)).pipe(
      mergeMap(() => {
        const updates: Person[] = person.friends.map((friendName) => {
          const friend = this.persons[friendName];
          // remove this person as a friend from everyone's friend list
          friend.friends = friend.friends.filter((f) => f !== person.name);
          return { ...friend };
        });
        delete this.persons[person.name];
        return from(this.db.persons.bulkPut(updates));
      }),
      map(() => {
        this.subject.next(Object.values(this.persons));
        return person.name;
      })
    );
  }
}
