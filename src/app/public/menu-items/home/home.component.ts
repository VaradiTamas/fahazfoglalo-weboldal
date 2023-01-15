import { Component, OnInit } from '@angular/core';
import {state, style, trigger, transition, animate} from '@angular/animations';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [
    // image animation
    trigger('imageAnimation', [
      state('first', style({ })),
      state('second', style({ })),
      state('third', style({ })),
      state('fourth', style({ })),
      transition('void => first', [
        style({
          transform: 'translateY(-2000px)',
          filter: 'blur(8px)'
        }),
        animate(600, style({
          transform: 'translateY(0px)',
          filter: 'blur(6px)'
        })),
        animate(600, style({
          filter: 'blur(6px)'
        })),
        animate(600, style({
          filter: 'blur(0px)',
          transform: 'scale(1.2)',
        })),
        animate(1200, style({
          transform: 'scale(1.2)'
        }))
      ]),
      transition('first => second', [
        style({
          transform: 'translateX(-2000px)',
          filter: 'blur(8px)'
        }),
        animate(600, style({
          transform: 'translateX(0px)',
          filter: 'blur(6px)'
        })),
        animate(600, style({
          filter: 'blur(6px)'
        })),
        animate(600, style({
          filter: 'blur(0px)',
          transform: 'scale(1.2)',
        })),
        animate(1200, style({
          transform: 'scale(1.2)'
        }))
      ]),
      transition('second => third', [
        style({
          transform: 'translateX(2000px)',
          filter: 'blur(8px)'
        }),
        animate(600, style({
          transform: 'translateX(0px)',
          filter: 'blur(6px)'
        })),
        animate(600, style({
          filter: 'blur(6px)'
        })),
        animate(600, style({
          filter: 'blur(0px)',
          transform: 'scale(1.2)',
        })),
        animate(1200, style({
          transform: 'scale(1.2)'
        }))
      ]),
      transition('third => fourth', [
        style({
          transform: 'scale(1.2)',
        }),
        animate(2000, style({
          transform: 'scale(1.3)'
        })),
        animate(2500, style({
          transform: 'scale(1.4)',
          opacity: 0
        }))
      ]),
      transition('fourth => first', [
        style({
          transform: 'translateY(-2000px)',
          filter: 'blur(8px)'
        }),
        animate(600, style({
          transform: 'translateY(0px)',
          filter: 'blur(6px)'
        })),
        animate(600, style({
          filter: 'blur(6px)'
        })),
        animate(600, style({
          filter: 'blur(0px)',
          transform: 'scale(1.2)',
        })),
        animate(1200, style({
          transform: 'scale(1.2)'
        }))
      ]),
    ]),
    // titles animation
    trigger('titleAnimation', [
      state('first', style({
        // transform: 'translateY(-2000px)'
      })),
      state('second', style({
        // transform: 'translateX(2000px)'
      })),
      state('third', style({
        // transform: 'translateX(-2000px)'
      })),
      state('fourth', style({
        // transform: 'translateY(-2000px)'
      })),
      transition('void => first', [
        style({
          transform: 'translateY(-2000px)',
        }),
        animate(600, style({
          transform: 'translateY(0px)',
        })),
        animate(600, style({
        })),
        animate(600, style({
          transform: 'scale(1.2)',
        })),
        animate(1200, style({
          transform: 'scale(1.2)'
        }))
      ]),
      transition('first => second', [
        animate(10, style({
          transform: 'translateX(-2000px)',
        })),
        animate(590, style({
        })),
        animate(600, style({
        })),
        animate(600, style({
          transform: 'scale(1.2)',
        })),
        animate(1200, style({
          transform: 'scale(1.2)'
        }))
      ]),
      transition('second => third', [
        animate(10, style({
          transform: 'translateX(2000px)',
        })),
        animate(590, style({
        })),
        animate(600, style({
        })),
        animate(600, style({
          transform: 'scale(1.2)',
        })),
        animate(1200, style({
          transform: 'scale(1.2)'
        }))
      ]),
      transition('third => fourth', [
        style({
          transform: 'scale(1.2)'
        }),
        animate(3000, style({
          transform: 'scale(1.6)',
        })),
        animate(1500, style({
          transform: 'scale(1.8)',
        })),
        animate(10, style({
          transform: 'translateY(-2000px)',
        })),
      ]),
      transition('fourth => first', [
        animate(10, style({
          transform: 'translateY(-2000px)',
        })),
        animate(590, style({
        })),
        animate(600, style({
        })),
        animate(600, style({
          transform: 'scale(1.2)',
        })),
        animate(1200, style({
          transform: 'scale(1.2)'
        })),
      ])
    ]),
    trigger('darkImageAnimation', [
      state('third', style({ })),
      state('fourth', style({ })),
      transition('third => fourth', [
        animate(1500),
        animate(2000, style({
          background: 'black'
        })),
        animate(1000, style({
          background: 'black'
        }))
      ])
    ]),
    trigger('darkTitleAnimation', [
      state('third', style({ })),
      state('fourth', style({ })),
      transition('third => fourth', [
        animate(3500),
        animate(1000, style({
          background: 'black'
        }))
      ])
    ])
  ]
})

export class HomeComponent implements OnInit {
  state = 'first';
  isLogoVisible = false;
  headerText = 'TERMÉSZETKÖZELI';
  counter = 0;
  currentImageSource = '';
  previousImageSource = '';
  imgSrc1 = 'assets/outside/17.jpg';
  imgSrc2 = 'assets/inside/5.jpg';
  imgSrc3 = 'assets/outside/1.jpg';
  imgBlack = 'assets/home-page-animation-pictures/black.png';

  ngOnInit(): void {
    this.currentImageSource = this.imgSrc1;
    this.previousImageSource = this.imgSrc1;
  }

  toggleState(): void {
    switch (this.counter){
      case 0: {
        this.isLogoVisible = false;
        this.currentImageSource = this.imgSrc1;
        this.state = 'first';
        this.headerText = 'TERMÉSZETKÖZELI';
        break;
      }
      case 1: {
        this.previousImageSource = this.imgSrc1;
        this.currentImageSource = this.imgSrc2;
        this.state = 'second';
        this.headerText = 'NYUGALMAS';
        break;
      }
      case 2: {
        this.previousImageSource = this.imgSrc2;
        this.currentImageSource = this.imgSrc3;
        this.state = 'third';
        this.headerText = 'LIDÉRCES';
        break;
      }
      case 3: {
        this.isLogoVisible = true;
        this.state = 'fourth';
        this.previousImageSource = this.imgBlack;
        break;
      }
    }
  }

  onDone($event): void {
    if (this.counter === 3){
      this.counter = 0;
    } else {
      this.counter++;
    }

    this.toggleState();
  }

}
