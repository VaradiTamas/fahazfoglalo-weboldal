import {Component, Input, OnInit} from '@angular/core';
import { Image } from '../image.interface';

@Component({
  selector: 'app-images-layout',
  templateUrl: './images-layout.component.html',
  styleUrls: ['./images-layout.component.css']
})
export class ImagesLayoutComponent implements OnInit {

  public selectedImage?: number = null;

  @Input() images: Array<Image>;

  constructor() { }

  ngOnInit(): void { }

}
