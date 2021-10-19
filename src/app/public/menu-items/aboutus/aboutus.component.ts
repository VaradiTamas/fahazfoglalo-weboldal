import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-aboutus',
  templateUrl: './aboutus.component.html',
  styleUrls: ['./aboutus.component.css']
})
export class AboutusComponent implements OnInit {
  latitude = 47.880152;
  longitude = 20.362495;

  constructor() { }

  ngOnInit(): void {
  }

}
