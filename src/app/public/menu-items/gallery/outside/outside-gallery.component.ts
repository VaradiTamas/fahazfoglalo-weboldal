import { Component, OnInit } from '@angular/core';
import {Image} from '../../../components/gallery/image.interface';

@Component({
  selector: 'app-park',
  templateUrl: './outside-gallery.component.html',
  styleUrls: ['./outside-gallery.component.css']
})
export class OutsideGalleryComponent implements OnInit {

  public images = [
    { path: 'assets/outside/1.jpg' },
    { path: 'assets/outside/2.jpg' },
    { path: 'assets/outside/3.jpg' },
    { path: 'assets/outside/4.jpg' },
    { path: 'assets/outside/5.jpg' },
    { path: 'assets/outside/6.jpg' },
    { path: 'assets/outside/7.jpg' },
    { path: 'assets/outside/8.jpg' },
    { path: 'assets/outside/9.jpg' },
    { path: 'assets/outside/10.jpg' },
    { path: 'assets/outside/11.jpeg' },
    { path: 'assets/outside/12.jpeg' },
    { path: 'assets/outside/13.jpeg' },
    { path: 'assets/outside/14.jpeg' },
    { path: 'assets/outside/15.jpg' },
    { path: 'assets/outside/16.jpg' },
    { path: 'assets/outside/17.jpg' },
  ] as Array<Image>;

  constructor() { }

  ngOnInit(): void { }

}
