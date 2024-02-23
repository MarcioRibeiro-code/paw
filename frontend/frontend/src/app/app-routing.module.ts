import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LogInComponent } from './components/log-in/log-in.component';
import { EventsComponent } from './components/events/events.component';
import { LocalComponent } from './components/local/local.component';
import { UserComponent } from './components/user/user.component';
import { EventComponent } from './components/event/event.component';
import { LocalUnitComponent } from './components/local-unit/local-unit.component';
import { TicketComponent } from './components/ticket/ticket.component';
import { authGuardGuard } from './guards/auth-guard.guard';
import { RgisterComponent } from './components/register/rgister.component';

const routes: Routes = [
  { path: '', component: LogInComponent },
  { path: 'register', component: RgisterComponent },
  { path: 'events', component: EventsComponent , canActivate: [authGuardGuard]},
  { path: 'locals', component: LocalComponent , canActivate: [authGuardGuard]},
  { path: 'user', component: UserComponent , canActivate: [authGuardGuard]},
  { path: 'events/:id', component: EventComponent , canActivate: [authGuardGuard]},
  { path: 'locals/:id', component: LocalUnitComponent , canActivate: [authGuardGuard]},
  { path: 'ticket/:id', component: TicketComponent , canActivate: [authGuardGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
