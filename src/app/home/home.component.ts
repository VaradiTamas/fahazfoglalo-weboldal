import { Component, OnInit } from '@angular/core';
import {state, style, trigger, transition, animate, keyframes} from "@angular/animations";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [
    trigger('fade', [
      state('first', style({ filter: 'blur(0px)'})),
      state('second', style({ filter: 'blur(0px)' })),
      state('third', style({ filter: 'blur(0px)' })),
      transition('void => first', [
        style({
          transform: 'translateX(0px)'
        }),
        animate(1000)
      ]),
      transition('first => second', [
        animate(3000, keyframes([
          style({
            transform: 'translateX(-2000px)',
            filter: 'blur(8px)',
            offset: 0
          }),
          style({
            transform: 'translateX(0px)',
            filter: 'blur(6px)',
            offset: 0.2
          }),
          style({
            filter: 'blur(6px)',
            offset: 0.4
          }),
          style({
            transform: 'scale(1.2)',
            filter: 'blur(0px)',
            offset: 0.6
          }),
          style({
            filter: 'blur(0px)',
            offset: 1
          })
        ]))
      ]),
      transition('second => third', [
        animate(3000, keyframes([
          style({
            transform: 'translateX(2000px)',
            filter: 'blur(8px)',
            offset: 0
          }),
          style({
            transform: 'translateX(0px)',
            filter: 'blur(6px)',
            offset: 0.2
          }),
          style({
            transform: 'translateX(0px)',
            filter: 'blur(6px)',
            offset: 0.4
          }),
          style({
            transform: 'scale(1.2)',
            filter: 'blur(0px)',
            offset: 0.6
          }),
          style({
            filter: 'blur(0px)',
            offset: 1
          })
        ]))
      ]),
      transition('third => first', [
        animate(3000, keyframes([
          style({
            transform: 'translateY(-2000px)',
            filter: 'blur(8px)',
            offset: 0
          }),
          style({
            transform: 'translateY(0px)',
            filter: 'blur(6px)',
            offset: 0.2
          }),
          style({
            filter: 'blur(6px)',
            offset: 0.4
          }),
          style({
            transform: 'scale(1.2)',
            filter: 'blur(0px)',
            offset: 0.6
          }),
          style({
            filter: 'blur(0px)',
            offset: 1
          })
        ]))
      ]),
    ]),
    trigger('titleChange', [
      state('first', style({ })),
      state('second', style({ })),
      state('third', style({ })),
      transition('void => first', [
        style({
          transform: 'translateX(0px)'
        }),
        animate(1000)
      ]),
      transition('first => second', [
        animate(3000, keyframes([
          style({
            transform: 'translateX(-2000px)',
            filter: 'blur(8px)',
            offset: 0
          }),
          style({
            transform: 'translateX(0px)',
            filter: 'blur(6px)',
            offset: 0.2
          }),
          style({
            filter: 'blur(6px)',
            offset: 0.4
          }),
          style({
            filter: 'blur(0px)',
            offset: 0.6
          }),
          style({
            filter: 'blur(0px)',
            offset: 1
          })
        ]))
      ]),
      transition('second => third', [
        animate(3000, keyframes([
          style({
            transform: 'translateX(2000px)',
            filter: 'blur(8px)',
            offset: 0
          }),
          style({
            transform: 'translateX(0px)',
            filter: 'blur(6px)',
            offset: 0.2
          }),
          style({
            transform: 'translateX(0px)',
            filter: 'blur(6px)',
            offset: 0.4
          }),
          style({
            filter: 'blur(0px)',
            offset: 0.6
          }),
          style({
            filter: 'blur(0px)',
            offset: 1
          })
        ]))
      ]),
      transition('third => first', [
        animate(3000, keyframes([
          style({
            transform: 'translateY(-2000px)',
            filter: 'blur(8px)',
            offset: 0
          }),
          style({
            transform: 'translateY(0px)',
            filter: 'blur(6px)',
            offset: 0.2
          }),
          style({
            filter: 'blur(6px)',
            offset: 0.4
          }),
          style({
            filter: 'blur(0px)',
            offset: 0.6
          }),
          style({
            filter: 'blur(0px)',
            offset: 1
          })
        ]))
      ]),
    ])
  ]
//     trigger('divState', [
//       state('first', style({
//         opacity: 1,
//         transform: 'translateX(0)'
//       })),
//       transition('void => *', [
//         style({
//           opacity: 0,
//           transform: 'translateX(-100px)'
//         }),
//         animate(2000)
//       ])
//     ]),
//     trigger('secondState', [
//       state('second', style({
//         opacity: 1,
//         transform: 'translateX(0)'
//       })),
//       transition('void => *', [
//         style({
//           opacity: 0,
//           transform: 'translateX(100px)'
//         }),
//         animate(2000)
//       ])
//     ]),
//   ]
})

export class HomeComponent implements OnInit {
  state = 'first';
  titleState = 'first';
  headerText = 'ELSO';
  counter = 0;
  imageSource = '';
  previousImageSource = '';
  imgSrc1 = 'assets/icon/fah.jpg';
  imgSrc2 = 'assets/house/house2.jpg';
  imgSrc3 = 'assets/house/house3.jpg';

  ngOnInit() {
    this.imageSource = this.imgSrc1;
    this.previousImageSource = this.imgSrc1;
  }

  toggleState() {
    switch(this.counter){
      case 0: {
        this.previousImageSource = this.imgSrc3;
        this.imageSource = this.imgSrc1;
        this.state = 'first';
        this.titleState = 'first';
        this.headerText = 'ELSO';
        break;
      }
      case 1: {
        this.previousImageSource = this.imgSrc1;
        this.imageSource = this.imgSrc2;
        this.state = 'second';
        this.titleState = 'second';
        this.headerText = 'MASODIK';
        break;
      }
      case 2: {
        this.previousImageSource = this.imgSrc2;
        this.imageSource = this.imgSrc3;
        this.state = 'third';
        this.titleState = 'third';
        this.headerText = 'HARMADIK';
        break;
      }
    }
  }

  onDone($event) {
    if(this.counter === 2){
      this.counter = 0;
    } else {
      this.counter++;
    }

    this.toggleState();
  }

}
