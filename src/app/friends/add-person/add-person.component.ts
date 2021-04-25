import { Person } from './../person';
import { FriendService } from './../friend.service';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ViewChild } from '@angular/core';
import { ElementRef } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-person',
  templateUrl: './add-person.component.html',
  styleUrls: ['./add-person.component.scss'],
})
export class AddPersonComponent implements OnInit {
  selectedFriends: Set<string> = new Set();
  searchTerm: string;
  friendSearchResults: string[];
  @ViewChild('nameInput') nameInputRef: ElementRef;
  errorMessage: string;
  processing = false;

  constructor(
    private friendService: FriendService,
    private snackBar: MatSnackBar
  ) {}

  searchFriends(event: Event): void {
    event.preventDefault();
    this.friendService.searchFriends(this.searchTerm).subscribe(
      (names) => {
        this.friendSearchResults = names;
      },
      (err) => console.error(err)
    );
  }

  addPerson(form: NgForm): void {
    this.errorMessage = null;
    if (!form.valid) {
      this.errorMessage = 'Form is invalid!';
      return;
    }
    const { name, weight, age } = form.value;
    const person: Person = {
      name,
      age,
      weight,
      friends: [...this.selectedFriends],
    };

    this.processing = true;
    this.friendService.addPerson(person).subscribe(
      (res) => {
        this.selectedFriends.clear();
        this.friendSearchResults = [];
        form.resetForm();
        this.nameInputRef.nativeElement.focus();
        this.processing = false;
        this.snackBar.open(`Successfully added ${res}`, null, {
          duration: 2000,
        });
      },
      (err) => {
        console.error(err);
        this.errorMessage = `There was a problem adding ${name}: ${err.message}`;
        this.processing = false;
      }
    );
  }

  ngOnInit(): void {}
}
