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

  @ViewChild('nameInput') nameInputRef: ElementRef;

  constructor(private friendService: FriendService) { }

  addPerson(form: NgForm): void {
    if (!form.valid) {
      console.log('Form is invalid!');
      return;
    }
    // console.log(form);
    const {name, weight, age} = form.value;
    const person = new Person(name, age, weight);
    this.friendService.addPerson(person);
    form.resetForm();
    this.nameInputRef.nativeElement.focus();
  }

  ngOnInit(): void {
  }

}
