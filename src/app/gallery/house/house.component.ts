import { Component, OnInit } from '@angular/core';
import {Image} from '../../gallery-components/image.interface';

@Component({
  selector: 'app-house',
  templateUrl: './house.component.html',
  styleUrls: ['./house.component.css']
})
export class HouseComponent implements OnInit {

  public images = [
    {path: 'assets/park/park1.jpg'},
    {path: 'assets/park/park2.jpg'},
    {path: 'assets/park/park3.jpg'},
    {path: 'assets/park/park4.jpg'},
  ] as Array<Image>;

  constructor() { }

  ngOnInit(): void {
  }

}
