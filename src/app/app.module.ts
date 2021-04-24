import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FriendsModule } from './friends/friends.module';
import { HomeComponent } from './home/home.component';
import { VisualizeComponent } from './visualize/visualize.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    VisualizeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    FriendsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
