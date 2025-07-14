import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-player',
  templateUrl: './edit-player.component.html',
  styleUrls: ['./edit-player.component.scss']
})
export class EditPlayerComponent {

  allProfilePictures = ['female_avatar.png', 'profile.webp', 'male.png'];

  constructor(public dialogRef: MatDialogRef<EditPlayerComponent>) {}

}
