import { AfterViewInit, Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PopupTelephoneDialogComponent } from './popup-telephone-dialog/popup-telephone-dialog.component';
import { sleep } from '../../screen-size-constants';
import { trigger, state, style, transition, animate } from '@angular/animations';

const animationTime = 180;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  animations: [
    trigger('gallery', [
      state('closed', style({
        opacity: 0
      })),
      state('opened', style({})),
      transition('opened <=> closed', animate(animationTime)),
    ]),
    trigger('voucher', [
      state('closed', style({
        transform: 'translateY(-45px)',
        opacity: 0
      })),
      state('opened', style({
        transform: 'translateY(0px)',
      })),
      transition('opened <=> closed', animate(animationTime)),
    ]),
    trigger('price', [
      state('closed', style({
        transform: 'translateY(-90px)',
        opacity: 0
      })),
      state('opened', style({
        transform: 'translateY(0px)',
      })),
      transition('opened <=> closed', animate(animationTime)),
    ]),
    trigger('faq', [
      state('closed', style({
        transform: 'translateY(-135px)',
        opacity: 0
      })),
      state('opened', style({
        transform: 'translateY(0px)',
      })),
      transition('opened <=> closed', animate(animationTime)),
    ]),
    trigger('contact', [
      state('closed', style({
        transform: 'translateY(-180px)',
        opacity: 0
      })),
      state('opened', style({
        transform: 'translateY(0px)',
      })),
      transition('opened <=> closed', animate(animationTime)),
    ]),
    trigger('reservation', [
      state('closed', style({
        transform: 'translateY(-225px)',
        opacity: 0
      })),
      state('opened', style({
        transform: 'translateY(0px)',
      })),
      transition('opened <=> closed', animate(animationTime)),
    ]),
    trigger('social-media', [
      state('closed', style({
        transform: 'translateY(-270px)',
        opacity: 0
      })),
      state('opened', style({
        transform: 'translateY(0px)',
      })),
      transition('opened <=> closed', animate(animationTime)),
    ]),
  ]
})
export class HeaderComponent implements OnInit, AfterViewInit {
  @ViewChild('navbar') navbar;
  @ViewChild('navbar_collapse') navbarCollapse;
  @ViewChild('gallery') gallery;
  @ViewChild('voucher') voucher;
  @ViewChild('price') price;
  @ViewChild('faq') faq;
  @ViewChild('contact') contact;
  @ViewChild('toggler') toggler;
  @ViewChild('toggler_icon') togglerIcon;
  @ViewChild('telephone_icon') telephone;
  @ViewChild('instagram_icon') instagram;
  @ViewChild('facebook_icon') facebook;
  isDialogOpened = false;
  isNavigationMenuOpened = false;
  previousScrollPosition = window.pageYOffset;
  state = 'closed';

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {
    this.setAnimationState();
  }

  ngAfterViewInit(): void {
    this.designMenu();
  }

  setAnimationState(): void {
    if (window.innerWidth <= 992) {
      this.state = 'closed';
    } else {
      this.state = 'opened';
    }
  }

  openDialog(): void {
    if (!this.isDialogOpened){
      const dialogRef = this.dialog.open(PopupTelephoneDialogComponent, { panelClass: 'telephone-dialog-container' });
      this.isDialogOpened = true;
      this.state = 'closed';
      dialogRef.afterClosed().subscribe(result => {
        this.isDialogOpened = false;
        this.state = 'opened';
      });
    }
    else {
      this.state = 'opened';
      this.isDialogOpened = false;
      this.dialog.closeAll();
    }
  }

  async onToggleClick(): Promise<void> {
    await this.openOrCloseNavbar();
  }

  async onLogoClick(): Promise<void> {
    if (this.isNavigationMenuOpened) {
      await this.openOrCloseNavbar();
    }
  }

  async openOrCloseNavbar(): Promise<void> {
    if (window.innerWidth > 992) {
      return;
    }
    if (this.isNavigationMenuOpened) {
      this.isNavigationMenuOpened = false;
      this.state = 'closed';
      await sleep(animationTime);
      this.navbarCollapse.nativeElement.style.display = 'none';
    } else {
      this.navbarCollapse.nativeElement.style.display = 'inline-block';
      this.isNavigationMenuOpened = true;
      this.state = 'opened';
    }
  }

  @HostListener('window:resize')
  onResize(): void {
    this.designMenu();
    if (!this.isNavigationMenuOpened) {
      this.setAnimationState();
    }
  }

  @HostListener('window:scroll')
  async onScroll(): Promise<void> {
    this.designMenu();
    const currentScrollPosition = window.pageYOffset;
    if (this.previousScrollPosition > currentScrollPosition) {
      this.navbar.nativeElement.style.top = '0';
    } else if (currentScrollPosition > 120) {
      this.navbar.nativeElement.style.top = '-120px';
      if (this.isNavigationMenuOpened) {
        await this.openOrCloseNavbar();
      }
    }
    this.previousScrollPosition = currentScrollPosition;
  }

  @HostListener('window:click', ['$event'])
  async onClick(event: MouseEvent): Promise<void> {
    if (event.y > this.navbarCollapse.nativeElement.getBoundingClientRect().bottom) {
      if (this.isNavigationMenuOpened) {
        await this.openOrCloseNavbar();
      }
    }
  }

  designMenu(): void {
    if (window.pageYOffset === 0 && window.innerWidth >= 992) {
      this.makeMenuItemsWhite();
      this.navbar.nativeElement.style.backgroundColor = 'transparent';
      this.navbar.nativeElement.style.backgroundImage = 'linear-gradient(to bottom, rgba(0,0,0,0.8) 10%, rgba(0,0,0,0) 100%)';
    }
    if (window.pageYOffset === 0 && window.innerWidth < 992) {
      this.makeMenuItemsGreen();
      this.toggler.nativeElement.style.borderColor = '#ffffff';
      this.togglerIcon.nativeElement.style.backgroundImage = 'url("data:image/svg+xml;charset=utf8,%3Csvg viewBox=\'0 0 32 32\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath stroke=\'rgba(255,255,255, 1)\' stroke-width=\'3\' stroke-linecap=\'round\' stroke-miterlimit=\'10\' d=\'M4 8h24M4 16h24M4 24h24\'/%3E%3C/svg%3E")';
      this.navbar.nativeElement.style.backgroundColor = 'transparent';
      this.navbar.nativeElement.style.backgroundImage = 'linear-gradient(to bottom, rgba(0,0,0,0.8) 10%, rgba(0,0,0,0) 100%)';
    }
    if (window.pageYOffset !== 0 && window.innerWidth >= 992) {
      this.makeMenuItemsGreen();
      this.navbar.nativeElement.style.backgroundColor = '#ffffff';
      this.navbar.nativeElement.style.backgroundImage = 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 100%)';
    }
    if (window.pageYOffset !== 0 && window.innerWidth < 992) {
      this.makeMenuItemsGreen();
      this.toggler.nativeElement.style.borderColor = 'darkolivegreen';
      this.togglerIcon.nativeElement.style.backgroundImage = 'url("data:image/svg+xml;charset=utf8,%3Csvg viewBox=\'0 0 32 32\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath stroke=\'rgba(85,107,47, 1)\' stroke-width=\'3\' stroke-linecap=\'round\' stroke-miterlimit=\'10\' d=\'M4 8h24M4 16h24M4 24h24\'/%3E%3C/svg%3E")';
      this.navbar.nativeElement.style.backgroundColor = '#ffffff';
      this.navbar.nativeElement.style.backgroundImage = 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 100%)';
    }
  }

  makeMenuItemsGreen(): void {
    this.gallery.nativeElement.style.color = 'darkolivegreen';
    this.voucher.nativeElement.style.color = 'darkolivegreen';
    this.price.nativeElement.style.color = 'darkolivegreen';
    this.faq.nativeElement.style.color = 'darkolivegreen';
    this.contact.nativeElement.style.color = 'darkolivegreen';
    this.facebook.nativeElement.src = './assets/icon/facebook_green.svg';
    this.instagram.nativeElement.src = './assets/icon/instagram_green.svg';
    this.telephone.nativeElement.src = './assets/icon/telephone_green.svg';
  }

  makeMenuItemsWhite(): void {
    this.gallery.nativeElement.style.color = '#ffffff';
    this.voucher.nativeElement.style.color = '#ffffff';
    this.price.nativeElement.style.color = '#ffffff';
    this.faq.nativeElement.style.color = '#ffffff';
    this.contact.nativeElement.style.color = '#ffffff';
    this.telephone.nativeElement.src = './assets/icon/telephone.svg';
    this.facebook.nativeElement.src = './assets/icon/facebook.svg';
    this.instagram.nativeElement.src = './assets/icon/instagram.svg';
  }
}
