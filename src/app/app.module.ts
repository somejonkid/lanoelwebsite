import { NgModule } from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { GameService } from './services/games.service';

@NgModule({
  imports: [
    BrowserModule,
    HttpModule
  ],
  declarations: [
    AppComponent,
    NavbarComponent
  ],
  providers: [
    GameService
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }