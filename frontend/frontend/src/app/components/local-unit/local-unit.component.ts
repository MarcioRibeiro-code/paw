import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RestService } from 'src/app/services/rest.service';
import { Ticket } from 'src/app/models/Ticket';
import { Locals } from 'src/app/models/Local';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-local-unit',
  templateUrl: './local-unit.component.html',
  styleUrls: ['./local-unit.component.css']
})
export class LocalUnitComponent implements OnInit {
  local:Locals | undefined;
  tickets:Ticket[] =[];
  

  constructor(private rest: RestService, private route: ActivatedRoute, private router: Router,public datePipe: DatePipe) {}

  ngOnInit(): void {
    var idTemp = this.route.snapshot.params['id'];
    this.rest.getLocal(idTemp).subscribe((data : any)=>{
      console.log(data)
      this.local = data;
    })
    this.rest.getTicketsLocal(idTemp).subscribe((data1 : any)=>{
      console.log(data1)
      this.tickets = data1;
    })
  }
}

