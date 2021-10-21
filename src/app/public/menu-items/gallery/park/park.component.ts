import { Component, OnInit } from '@angular/core';
import {Image} from '../../../components/gallery/image.interface';

@Component({
  selector: 'app-park',
  templateUrl: './park.component.html',
  styleUrls: ['./park.component.css']
})
export class ParkComponent implements OnInit {

  public images = [
    {path: 'assets/park/park1.jpg'},
    {path: 'assets/park/park2.jpg'},
    {path: 'assets/park/park3.jpg'},
    {path: 'assets/park/park4.jpg'},
  ] as Array<Image>;

  constructor() { }

  ngOnInit(): void { }

}
