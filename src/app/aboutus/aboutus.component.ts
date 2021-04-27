import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-aboutus',
  templateUrl: './aboutus.component.html',
  styleUrls: ['./aboutus.component.css']
})
export class AboutusComponent implements OnInit {
  latitude = 51.678418;
  longitude = 7.809007;

  constructor() { }

  ngOnInit(): void {
  }

}
