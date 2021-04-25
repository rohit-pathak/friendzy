import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import {MatListModule} from '@angular/material/list';
import { AddPersonComponent } from './add-person/add-person.component';
import { PersonListComponent } from './person-list/person-list.component';
import { FriendsGraphComponent } from './friends-graph/friends-graph.component';


@NgModule({
  declarations: [
    AddPersonComponent,
    PersonListComponent,
    FriendsGraphComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatExpansionModule,
    MatListModule,
  ],
  exports: [
    AddPersonComponent,
    PersonListComponent,
    FriendsGraphComponent,
  ]
})
export class FriendsModule { }
