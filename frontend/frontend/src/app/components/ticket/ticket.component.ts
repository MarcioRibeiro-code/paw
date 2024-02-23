import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RestService } from 'src/app/services/rest.service';
import { Ticket } from 'src/app/models/Ticket';
import { User } from 'src/app/models/User';
import { Promotion } from 'src/app/models/Promotion';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.css']
})
export class TicketComponent implements OnInit {
  ticket: Ticket | undefined;
  user: User | undefined;
  currentPrice: number | undefined;
  selectedPromotion: number | undefined;
  constructor(private rest: RestService, private route: ActivatedRoute, private router: Router,public datePipe: DatePipe) {}

  ngOnInit(): void {
    var idTemp = this.route.snapshot.params['id'];
    this.rest.getTickets(idTemp).subscribe((data: any) => {
      console.log(data);
      this.ticket = data[0];
      this.currentPrice = this.ticket?.price as number; 
    });
    this.rest.getUser().subscribe((data: any) => {
      console.log(data);
      this.user = data.user;
    });
  }

  updateTicketPrice(): void {
    if (this.selectedPromotion !== undefined) {
      this.currentPrice = this.selectedPromotion;
    }
  }

  buyTicket(): void {
    var idTemp = this.route.snapshot.params['id'];
    this.rest.buyTicket(idTemp,this.currentPrice).subscribe(
      (error) => {
        console.error('Error:', error);
      }
    );
    this.router.navigate(['/user']);
  }


}
