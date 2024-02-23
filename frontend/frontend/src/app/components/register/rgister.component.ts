import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-rgister',
  templateUrl: './rgister.component.html',
  styleUrls: ['./rgister.component.css']
})
export class RgisterComponent implements OnInit {

  username:string;
  password:string;
  email:string;
  firstName:string;
  lastName:string;
  dateOfBirth:string;

  constructor(private router: Router, private authService: AuthService) { 
    this.username="";
    this.password="";
    this.email="";
    this.firstName="";
    this.lastName="";
    this.dateOfBirth="";
  }

  ngOnInit(): void {
  }


  register(): void {
    this.authService.register(this.username,this.password,this.email,this.firstName,this.lastName,this.dateOfBirth).subscribe(
      (response: any) => {
        
      },
      (error: any) => {
        console.error('Error:', error);
      }
    );
    this.router.navigate(['/']);
  }
}
