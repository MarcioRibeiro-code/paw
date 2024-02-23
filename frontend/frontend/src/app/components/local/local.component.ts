import { Locals } from 'src/app/models/Local';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RestService } from 'src/app/services/rest.service';

@Component({
  selector: 'app-locals',
  templateUrl: './local.component.html',
  styleUrls: ['./local.component.css']
})
export class LocalComponent implements OnInit {
  locais: Locals[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10; 
  totalPages: number = 0;
  pages: number[] = []; 
  selectedFilterOption: string = 'Name'; // Default to 'Name'
  filterValue: string = '';

  constructor(private rest: RestService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.getLocals();
  }

  getLocals() {
    this.rest.getLocals().subscribe(
      (data: Locals[]) => {
        console.log(data);
        this.locais = data.filter(local => {
          // Apply the filter based on the selected option
          switch (this.selectedFilterOption) {
            case 'Name':
              return local.name && local.name.toLowerCase().includes(this.filterValue.toLowerCase());
            case 'country':
              return local.country && local.country.toLowerCase().includes(this.filterValue.toLowerCase());
            case 'city':
              // Assuming you have a 'startTime' property of type Date in the 'Events' model
              return local.city && local.city.toString().toLowerCase().includes(this.filterValue.toLowerCase());
            case 'neighbourhood':
              return local.neighbourhood && local.neighbourhood.toLowerCase().includes(this.filterValue.toLowerCase());
            case 'street':
              return local.street && local.street.toString().toLowerCase().includes(this.filterValue.toLowerCase());
            default:
              return true; // Return true to include all events if no option is selected
          }
        });
        this.calculateTotalPages();
        this.generatePageArray();
      },
      (error) => {
        console.error('Error fetching locals:', error);
      }
    );
  }

  calculateTotalPages() {
    this.totalPages = Math.ceil(this.locais.length / this.itemsPerPage);
  }

  generatePageArray() {
    this.pages = Array(this.totalPages).fill(0).map((_, index) => index + 1);
  }

  applyFilter() {
    this.getLocals();
  }
}