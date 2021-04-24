import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-add-person',
  templateUrl: './add-person.component.html',
  styleUrls: ['./add-person.component.scss']
})
export class AddPersonComponent implements OnInit {

  constructor() { }

  addPerson(form: NgForm): void {
    console.log(form);
    console.log(form.valid);
  }

  ngOnInit(): void {
  }

}
