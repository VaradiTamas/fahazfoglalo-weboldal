import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-app-page-title',
  templateUrl: './app-page-title.component.html',
  styleUrls: ['./app-page-title.component.css']
})
export class AppPageTitleComponent implements OnInit {
  @Input()title: string;
  @Input()imgPath: string;

  constructor() { }

  ngOnInit(): void {
  }

}
