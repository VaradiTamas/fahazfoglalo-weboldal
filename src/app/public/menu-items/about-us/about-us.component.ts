import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-aboutus',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css']
})
export class AboutUsComponent implements OnInit {
  latitude = 47.880152;
  longitude = 20.362495;

  constructor() { }

  ngOnInit(): void {}

}
