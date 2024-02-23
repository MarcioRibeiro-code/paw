import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RestService } from 'src/app/services/rest.service';
import { Ticket } from 'src/app/models/Ticket';
import { Events } from 'src/app/models/Event';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {
  
  event:Events | undefined;
  tickets:Ticket[] =[];
  

  constructor(private rest: RestService, private route: ActivatedRoute, private router: Router,public datePipe: DatePipe) {}

  ngOnInit(): void {
    var idTemp = this.route.snapshot.params['id'];
    this.rest.getEvent(idTemp).subscribe((data : any)=>{
      console.log(data)
      this.event = data;
    })
    this.rest.getTicketsEvent(idTemp).subscribe((data1 : any)=>{
      console.log(data1)
      this.tickets = data1;
    })
  }
}
