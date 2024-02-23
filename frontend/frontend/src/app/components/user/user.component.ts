import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RestService } from 'src/app/services/rest.service';
import { User } from 'src/app/models/User';
import { Ticket } from 'src/app/models/Ticket';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent {

  user:User | undefined;
  tickets:Ticket[] =[];
  

  constructor(private rest: RestService, private route: ActivatedRoute, private router: Router, public datePipe: DatePipe) {}

  ngOnInit(): void {
    this.rest.getUser().subscribe((data : any)=>{
      console.log(data)
      this.user = data.user;
      this.tickets= data.tickets;
    })
  }

}
