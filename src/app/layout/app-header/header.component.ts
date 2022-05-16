import { AfterViewInit, Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PopupTelephoneDialogComponent } from './popup-telephone-dialog/popup-telephone-dialog.component';
import { NavbarComponent } from '../admin-header/navbar.component';
import {sleep} from "../../screen-size-constants";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
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

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.designMenu();
  }

  openDialog(): void {
    if (!this.isDialogOpened){
      const dialogRef = this.dialog.open(PopupTelephoneDialogComponent, { panelClass: 'telephone-dialog-container' });
      this.isDialogOpened = true;
      dialogRef.afterClosed().subscribe(result => {
        this.isDialogOpened = false;
      });
    }
    else {
      this.isDialogOpened = false;
      this.dialog.closeAll();
    }
  }

  async onToggleClick(): Promise<void> {
    if (this.isNavigationMenuOpened) {
      this.navbarCollapse.nativeElement.classList.remove('open-animation');
      this.navbarCollapse.nativeElement.classList.add('close-animation');
      await sleep(700);
      this.navbarCollapse.nativeElement.style.display = 'none';
      this.isNavigationMenuOpened = false;
    } else {
      this.navbarCollapse.nativeElement.style.display = 'inline-block';
      this.navbarCollapse.nativeElement.classList.remove('close-animation');
      this.navbarCollapse.nativeElement.classList.add('open-animation');
      this.isNavigationMenuOpened = true;
    }
  }

  @HostListener('window:resize')
  onResize(): void {
    this.designMenu();
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.designMenu();
    const currentScrollPosition = window.pageYOffset;
    if (this.previousScrollPosition > currentScrollPosition) {
      this.navbar.nativeElement.style.top = '0';
    } else if (currentScrollPosition > 120) {
      this.navbar.nativeElement.style.top = '-150px';
      this.navbarCollapse.nativeElement.style.display = 'none';
      this.isNavigationMenuOpened = false;
    }
    this.previousScrollPosition = currentScrollPosition;
  }

  @HostListener('window:click', ['$event'])
  onClick(event: MouseEvent): void {
    if (event.y > this.navbarCollapse.nativeElement.getBoundingClientRect().bottom) {
      this.navbarCollapse.nativeElement.style.display = 'none';
      this.isNavigationMenuOpened = false;
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
