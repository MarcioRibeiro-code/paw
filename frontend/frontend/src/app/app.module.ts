import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserComponent } from './components/user/user.component';
import { EventsComponent } from './components/events/events.component';
import { LocalComponent } from './components/local/local.component';
import { LogInComponent } from './components/log-in/log-in.component';
import { FormsModule } from '@angular/forms';
import { EventComponent } from './components/event/event.component';
import { LocalUnitComponent } from './components/local-unit/local-unit.component';
import { DatePipe } from '@angular/common';
import { TicketComponent } from './components/ticket/ticket.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { RgisterComponent } from './components/register/rgister.component';


@NgModule({
  declarations: [
    AppComponent,
    LogInComponent,
    UserComponent,
    EventsComponent,
    LocalComponent,
    EventComponent,
    LocalUnitComponent,
    TicketComponent,
    NavBarComponent,
    RgisterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }