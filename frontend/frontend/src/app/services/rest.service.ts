import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Events } from '../models/Event';
import { Locals } from '../models/Local';
import { User } from '../models/User';
import { Ticket } from '../models/Ticket';


const endpoint = 'http://localhost:3000/';

@Injectable({
  providedIn: 'root'
})
export class RestService {

    constructor(private http: HttpClient) { }
  
    getEvents(): Observable<Events[]> {
      const headers = new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem('token')}` });
      return this.http.get<Events[]>(endpoint + 'events/all', { headers });
    }
  
    getLocals(): Observable<Locals[]> {
      const headers = new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem('token')}` });
      return this.http.get<Locals[]>(endpoint + 'places/allfrontend', { headers });
    }

    getUser(): Observable<User> {
      const headers = new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem('token')}` });
      const id = localStorage.getItem('UserId');
      return this.http.get<User>(endpoint+'users/'+id+'/info', { headers });
    }

    getLocal(id:string): Observable<Locals> {
      const headers = new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem('token')}` });
      return this.http.get<Locals>(endpoint+'places/'+id+'/info', { headers });
    }

    getEvent(id:string): Observable<Events> {
      const headers = new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem('token')}` });
      return this.http.get<Events>(endpoint+'events/'+id+'/info', { headers });
    }
  
    getTicketsLocal(id:string): Observable<Ticket> {
      const headers = new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem('token')}` });
      return this.http.get<Ticket>(endpoint+'places/'+id+'/tickets', { headers });
    }

    getTicketsEvent(id:string): Observable<Ticket> {
      const headers = new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem('token')}` });
      return this.http.get<Ticket>(endpoint+'events/'+id+'/tickets', { headers });
    }

    getTickets(id:string): Observable<Ticket> {
      const headers = new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem('token')}` });
      return this.http.get<Ticket>(endpoint+'ticket/'+id+'/info', { headers });
    }

    buyTicket(id:string, promotion:number| undefined): Observable<RestModelResponse>{
      const headers = new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem('token')}` });
      const userId = localStorage.getItem('UserId');
      return this.http.post<RestModelResponse>(endpoint+'ticket/'+id+'/sell', new BuyModel( userId, promotion), { headers });
    }
}

export interface RestModelResponse{

}

export class BuyModel{

  constructor(public userId:string | null, public promotion:number | undefined){}

}
