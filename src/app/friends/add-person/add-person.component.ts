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

  searchFriends(): void {
    this.friendService.searchFriends(this.searchTerm).subscribe(
      names => {
        this.friendSearchResults = names;
      },
      err => console.error(err)
    );
  }

  addPerson(form: NgForm): void {
    if (!form.valid) {
      console.log('Form is invalid!');
      return;
    }
    // console.log(form);
    const {name, weight, age} = form.value;
    const person = new Person(name, age, weight, [...this.selectedFriends]);
    this.friendService.addPerson(person); // TODO: return observable from service and check for success
    this.selectedFriends.clear();
    this.friendSearchResults = [];
    form.resetForm();
    this.nameInputRef.nativeElement.focus();
  }

  ngOnInit(): void {
  }

}
