import { Component, OnInit } from '@angular/core';
import {Image} from '../../../components/gallery/image.interface';

@Component({
  selector: 'app-house',
  templateUrl: './house.component.html',
  styleUrls: ['./house.component.css']
})
export class HouseComponent implements OnInit {

  public images = [
    {path: 'assets/house/house01.jpg'},
    {path: 'assets/house/house02.jpg'},
    {path: 'assets/house/house03.jpg'},
    {path: 'assets/house/house04.jpg'},
    {path: 'assets/house/house05.jpg'},
    {path: 'assets/house/house06.jpg'},
    {path: 'assets/house/house07.jpg'},
    {path: 'assets/house/house08.png'},
  ] as Array<Image>;

  constructor() { }

  ngOnInit(): void {}

}
