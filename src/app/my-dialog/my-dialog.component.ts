import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-my-dialog',
  templateUrl: './my-dialog.component.html',
  styleUrls: ['./my-dialog.component.scss'],
})
export class MyDialogComponent {
  name: string = '';
  constructor(
    public dialogRef: MatDialogRef<MyDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { name: string }
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  close(): void {
    this.dialogRef.close("Neuer Wert vom Nutzer");
  }
}
