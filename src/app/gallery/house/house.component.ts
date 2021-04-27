import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-house',
  templateUrl: './house.component.html',
  styleUrls: ['./house.component.css']
})
export class HouseComponent implements OnInit {
  houseImages = [
    {path: "assets/house/house1.png"},
    {path: "assets/house/house2.jpg"},
    {path: "assets/house/house3.jpg"},
    {path: "assets/house/house4.jpg"},
    {path: "assets/house/house5.jpg"},
    {path: "assets/house/house6.jpg"},
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
