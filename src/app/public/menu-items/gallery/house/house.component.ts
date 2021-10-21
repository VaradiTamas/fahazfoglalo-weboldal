import { Component, OnInit } from '@angular/core';
import {Image} from '../../../components/gallery/image.interface';

@Component({
  selector: 'app-house',
  templateUrl: './house.component.html',
  styleUrls: ['./house.component.css']
})
export class HouseComponent implements OnInit {

  public images = [
    {path: 'assets/house/house1.png'},
    {path: 'assets/house/house2.jpg'},
    {path: 'assets/house/house3.jpg'},
    {path: 'assets/house/house4.jpg'},
    {path: 'assets/house/house5.jpg'},
    {path: 'assets/house/house6.jpg'},
  ] as Array<Image>;

  constructor() { }

  ngOnInit(): void {
  }

}
