import { Component, OnInit } from '@angular/core';
import {Image} from '../../../components/gallery/image.interface';

@Component({
  selector: 'app-house',
  templateUrl: './inside-gallery.component.html',
  styleUrls: ['./inside-gallery.component.css']
})
export class InsideGalleryComponent implements OnInit {

  public images = [
    { path: 'assets/inside/1.jpg' },
    { path: 'assets/inside/2.jpg' },
    { path: 'assets/inside/3.jpg' },
    { path: 'assets/inside/4.jpg' },
    { path: 'assets/inside/5.jpg' },
    { path: 'assets/inside/6.jpeg' },
    { path: 'assets/inside/7.jpeg' },
    { path: 'assets/inside/8.jpeg' },
    { path: 'assets/inside/9.jpeg' },
  ] as Array<Image>;

  constructor() { }

  ngOnInit(): void {}

}
