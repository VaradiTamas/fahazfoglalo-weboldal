import {Component, HostListener, OnInit} from '@angular/core';

@Component({
  selector: 'app-terms-and-conditions',
  templateUrl: './terms-and-conditions.component.html',
  styleUrls: ['./terms-and-conditions.component.css']
})
export class TermsAndConditionsComponent implements OnInit {
  pageTitle = 'Általános szerződési feltételek';

  constructor() { }

  ngOnInit(): void {
    this.setPageTitle();
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.setPageTitle();
  }

  setPageTitle(): void {
    if (window.innerWidth < 700) {
      this.pageTitle = 'ÁSZF';
    } else {
      this.pageTitle = 'Általános szerződési feltételek';
    }
  }
}
