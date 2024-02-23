import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent implements OnInit {

  email: string;
  password:string;

  constructor(private router: Router, private authService: AuthService) { 
    this.password="";
    this.email="";
  }

  ngOnInit(): void {
  }


  login(): void {
    this.authService.login(this.email, this.password).subscribe(
      (response: any) => {
        if (response && response.token) {
          localStorage.setItem('token', response.token); 
          localStorage.setItem('UserId', response.id); 
          this.router.navigate(['/events']);
        } else {
          alert('Error during login!');
        }
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

}

