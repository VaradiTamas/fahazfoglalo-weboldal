import {Component, HostListener, Input, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-app-page-title',
  templateUrl: './app-page-title.component.html',
  styleUrls: ['./app-page-title.component.css']
})
export class AppPageTitleComponent implements OnInit {
  @Input() title: string;
  @Input() imgPath: string;
  @ViewChild('pageTitleContainer') pageTitleContainer;

  constructor() { }

  ngOnInit(): void { }

  @HostListener('window:scroll')
  async onScroll(): Promise<void> {
    const currentScrollPosition = window.pageYOffset;
    this.pageTitleContainer.nativeElement.style.opacity = 1 - currentScrollPosition / 120;
  }

}
