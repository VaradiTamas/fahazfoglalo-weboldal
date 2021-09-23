import { Component, OnInit } from '@angular/core';
import {Image} from '../image.interface';

@Component({
  selector: 'app-house',
  templateUrl: './house.component.html',
  styleUrls: ['./house.component.css']
})
export class HouseComponent implements OnInit {

  public images = [
    {url: 'assets/park/park1.jpg'},
    {url: 'assets/park/park2.jpg'},
    {url: 'assets/park/park3.jpg'},
    {url: 'assets/park/park4.jpg'},
  ] as Array<Image>;

  constructor() { }

  ngOnInit(): void {
  }

}
