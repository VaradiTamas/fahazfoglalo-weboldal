import { Component, OnInit } from '@angular/core';
import {Image} from '../../../components/gallery/image.interface';

@Component({
  selector: 'app-sauna',
  templateUrl: './sauna.component.html',
  styleUrls: ['./sauna.component.css']
})
export class SaunaComponent implements OnInit {

  public images = [
    {path: 'assets/sauna/sauna1.jpg'},
    {path: 'assets/sauna/sauna2.jpg'},
    {path: 'assets/sauna/sauna3.png'},
    {path: 'assets/sauna/sauna4.jpg'},
    {path: 'assets/sauna/sauna5.jpg'},
    {path: 'assets/sauna/sauna6.png'},
    {path: 'assets/sauna/sauna7.png'}
  ] as Array<Image>;

  constructor() { }

  ngOnInit(): void { }

}
