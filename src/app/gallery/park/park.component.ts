import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-park',
  templateUrl: './park.component.html',
  styleUrls: ['./park.component.css']
})
export class ParkComponent implements OnInit {
  parkImages = [
    {name:'assets/park/park1.jpg'},
    {name:'assets/park/park2.jpg'},
    {name:'assets/park/park3.jpg'},
    {name:'assets/park/park4.jpg'},
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
