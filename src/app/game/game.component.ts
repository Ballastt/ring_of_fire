import { Component } from '@angular/core';
import { Game } from 'src/models/game';
import { MatDialog } from '@angular/material/dialog';
import { MyDialogComponent } from '../my-dialog/my-dialog.component';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent {
  pickCardAnimation = false;
  currentCard: string | undefined = '';
  game: Game = new Game();

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {
    this.newGame();
  }

  newGame() {
    this.game = new Game();
    console.log(this.game);
  }

  pickCard() {
    if (!this.pickCardAnimation) {
      this.currentCard = this.game.stack.pop();
      this.pickCardAnimation = true;
      console.log('New card:', this.currentCard);
      console.log('This game: ', this.game)

      setTimeout(() => {
        this.pickCardAnimation = false;
      }, 1500);
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(MyDialogComponent);

    dialogRef.afterClosed().subscribe((name: string) => {
      this.game.players.push(name);
      console.log('Dialog wurde geschlossen mit:', name);
      // Hier kannst du was mit "result" machen
    });
  }
}
