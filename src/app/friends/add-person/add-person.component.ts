import { Person } from './../person';
import { FriendService } from './../friend.service';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ViewChild } from '@angular/core';
import { ElementRef } from '@angular/core';

@Component({
  selector: 'app-add-person',
  templateUrl: './add-person.component.html',
  styleUrls: ['./add-person.component.scss']
})
export class AddPersonComponent implements OnInit {
  selectedFriends: Set<string> = new Set();

  searchTerm: string;
  friendSearchResults: string[];
  @ViewChild('nameInput') nameInputRef: ElementRef;

  constructor(private friendService: FriendService) { }

  searchFriends(event: Event): void {
    event.preventDefault();
    this.friendService.searchFriends(this.searchTerm).subscribe(
      names => {
        this.friendSearchResults = names;
      },
      err => console.error(err)
    );
  }

  addPerson(form: NgForm): void {
    if (!form.valid) {
      console.error('Form is invalid!');
      return;
    }
    const {name, weight, age} = form.value;
    const person: Person = {name, age, weight, friends: [...this.selectedFriends]};
    this.friendService.addPerson(person).subscribe( // TODO: disable form when processing
      (res) => {
        this.selectedFriends.clear();
        this.friendSearchResults = [];
        form.resetForm();
        this.nameInputRef.nativeElement.focus();
      },
      err => console.error(err) // Todo display error message in form
    );
  }

  ngOnInit(): void {
  }

}
