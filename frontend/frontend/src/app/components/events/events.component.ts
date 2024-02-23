import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Events } from '../../models/Event';
import { RestService } from 'src/app/services/rest.service';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {
  eventos: Events[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10; // Assuming 10 events per page
  totalPages: number = 0;
  pages: number[] = []; // Array to hold page numbers
  selectedFilterOption: string = 'title'; // Default to 'title'
  filterValue: string = '';

  constructor(private rest: RestService, private route: ActivatedRoute, private router: Router,public datePipe: DatePipe) {}

  ngOnInit(): void {
    this.getEvents();
  }

  getEvents() {
    this.rest.getEvents().subscribe(
      (data: Events[]) => {
        console.log(data);
        this.eventos = data.filter(event => {
          // Apply the filter based on the selected option
          switch (this.selectedFilterOption) {
            case 'title':
              return event.title && event.title.toLowerCase().includes(this.filterValue.toLowerCase());
            case 'description':
              return event.description && event.description.toLowerCase().includes(this.filterValue.toLowerCase());
            case 'startTime':
              // Assuming you have a 'startTime' property of type Date in the 'Events' model
              return event.startTime && event.startTime.toString().toLowerCase().includes(this.filterValue.toLowerCase());
            case 'eventType':
              return event.eventType && event.eventType.toLowerCase().includes(this.filterValue.toLowerCase());
            case 'price':
              return event.price && event.price.toString().toLowerCase().includes(this.filterValue.toLowerCase());
            default:
              return true; // Return true to include all events if no option is selected
          }
        });
        this.calculateTotalPages();
        this.generatePageArray();
      },
      (error) => {
        console.error('Error fetching events:', error);
      }
    );
  }

  calculateTotalPages() {
    this.totalPages = Math.ceil(this.eventos.length / this.itemsPerPage);
  }

  generatePageArray() {
    this.pages = Array(this.totalPages).fill(0).map((_, index) => index + 1);
  }

  applyFilter() {
    this.getEvents();
  }
}