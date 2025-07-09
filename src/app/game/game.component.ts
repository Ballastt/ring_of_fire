import { Component } from '@angular/core';
import { Game } from 'src/models/game';
import { MatDialog } from '@angular/material/dialog';
import { MyDialogComponent } from '../my-dialog/my-dialog.component';
import { Firestore, collectionData, collection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent {
  pickCardAnimation = false;
  currentCard: string | undefined = '';
  game: Game = new Game();

  // 🔥 Observable für Firestore-Daten
  games$: Observable<any[]>;

  constructor(private firestore: Firestore, public dialog: MatDialog) {
    const gamesCollection = collection(this.firestore, 'games');
    this.games$ = collectionData(gamesCollection, { idField: 'id' });

    this.games$.subscribe((games) => {
      console.log('Spiele aus Firestore:', games);
    });
  }


  ngOnInit(): void {
    this.newGame();

     // 🔍 Ausgabe zur Kontrolle
    this.games$.subscribe((games) => {
      console.log('Spiele aus Firestore:', games);
    });
  }

  newGame() {
    this.game = new Game();
    console.log(this.game);
  }

  pickCard() {
    if (!this.pickCardAnimation) {
      this.currentCard = this.game.stack.pop();
      this.pickCardAnimation = true;

      this.game.currentPlayer++;
      this.game.currentPlayer =
        this.game.currentPlayer % this.game.players.length;

      setTimeout(() => {
        if (this.currentCard) {
          this.game.playedCards.push(this.currentCard);
        }
        this.pickCardAnimation = false;
      }, 2000);
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(MyDialogComponent);

    dialogRef.afterClosed().subscribe((name: string) => {
      if (name && name.length > 0) {
        this.game.players.push(name);
        console.log('Dialog wurde geschlossen mit:', name);
        // Hier kannst du was mit "result" machen
      }
    });
  }
}
