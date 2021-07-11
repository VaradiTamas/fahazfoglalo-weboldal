import { Component, OnInit } from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {PopupTelephoneDialogComponent} from "./popup-telephone-dialog/popup-telephone-dialog.component";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  dialogIsOpened = false;

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {
  }

  openDialog() {
    if(!this.dialogIsOpened){
      let dialogRef = this.dialog.open(PopupTelephoneDialogComponent, { panelClass: 'telephone-dialog-container' });
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
