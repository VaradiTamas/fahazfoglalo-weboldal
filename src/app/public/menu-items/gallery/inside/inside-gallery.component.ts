import { Component, OnInit } from '@angular/core';
import {Image} from '../../../components/gallery/image.interface';

@Component({
  selector: 'app-house',
  templateUrl: './inside-gallery.component.html',
  styleUrls: ['./inside-gallery.component.css']
})
export class InsideGalleryComponent implements OnInit {

  public images = [
    { path: 'assets/inside/20220706_181607.jpg' },
    { path: 'assets/inside/20220706_180153.jpg' },
    { path: 'assets/inside/20220706_180410.jpg' },
    { path: 'assets/inside/20220706_180428.jpg' },
    { path: 'assets/inside/20220706_182032.jpg' },
    { path: 'assets/inside/image00010.jpeg' },
    { path: 'assets/inside/image00006.jpeg' },
    { path: 'assets/inside/image00008.jpeg' },
    { path: 'assets/inside/image00007.jpeg' },
  ] as Array<Image>;

  constructor() { }

  ngOnInit(): void {}

}
