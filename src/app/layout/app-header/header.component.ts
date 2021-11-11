import {Component, HostListener, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {PopupTelephoneDialogComponent} from './popup-telephone-dialog/popup-telephone-dialog.component';
import {SreenSize} from '../../screen-size-constants';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  dialogIsOpened = false;
  largeScreen = false;

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {
    this.isLargeScreen();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?): void {
    this.isLargeScreen();
  }

  isLargeScreen(): void{
    if (window.innerWidth >= SreenSize.lg){
      this.largeScreen = true;
    } else {
      this.largeScreen = false;
    }
  }

  openDialog(): void {
    if (!this.dialogIsOpened){
      const dialogRef = this.dialog.open(PopupTelephoneDialogComponent, { panelClass: 'telephone-dialog-container' });
      this.dialogIsOpened = true;
      dialogRef.afterClosed().subscribe(result => {
        this.dialogIsOpened = false;
      });
    }
    else {
      this.dialogIsOpened = false;
      this.dialog.closeAll();
    }
  }
}
