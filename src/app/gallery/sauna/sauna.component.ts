import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sauna',
  templateUrl: './sauna.component.html',
  styleUrls: ['./sauna.component.css']
})
export class SaunaComponent implements OnInit {
  saunaImages = [
    {path: "assets/sauna/sauna1.jpg"},
    {path: "assets/sauna/sauna2.jpg"},
    {path: "assets/sauna/sauna3.png"},
    {path: "assets/sauna/sauna4.jpg"},
    {path: "assets/sauna/sauna5.jpg"},
    {path: "assets/sauna/sauna6.png"},
    {path: "assets/sauna/sauna7.png"}
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
