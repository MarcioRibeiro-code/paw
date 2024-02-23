import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/User';

const endpoint = 'http://localhost:3000/';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(email: string, password:string): Observable<AuthRestModelResponse>{
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem('token')}` });
    return this.http.post<AuthRestModelResponse>(endpoint+"login/loginf", new LoginModel( email, password), { headers });
  }

  register( username:string, password:string, email:string, firstName:string, lastName:string, dateOfBirth:string): Observable<AuthRestModelResponse>{
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem('token')}` });
    return this.http.post<AuthRestModelResponse>(endpoint+"users/", new RegisterModel( username, password, email, firstName, lastName, dateOfBirth), { headers });
  }

}

export interface AuthRestModelResponse{

}

export class LoginModel{

  constructor(public email:string, public password:string){}

}

export class RegisterModel{

  constructor(public username:string,public password:string,public email:string,public firstName:string,public lastName:string,public dateOfBirth:string){}

}