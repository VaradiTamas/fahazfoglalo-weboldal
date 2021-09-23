import {Component, Input, OnInit} from '@angular/core';
import { Image } from '../image.interface';

@Component({
  selector: 'app-images',
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.css']
})
export class ImagesComponent implements OnInit {

  public selectedImage?: number = null;

  @Input() images: Array<Image>;

  constructor() { }

  ngOnInit(): void { }

  // public images = [
  //   {url: 'assets/park/park1.jpg'},
  //   {url: 'assets/park/park2.jpg'},
  //   {url: 'assets/park/park3.jpg'},
  //   {url: 'assets/park/park4.jpg'},
  // ] as Array<Image>;

}
