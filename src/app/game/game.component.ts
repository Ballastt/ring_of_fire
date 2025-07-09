import { Component } from '@angular/core';
import { Game } from 'src/models/game';
import { MatDialog } from '@angular/material/dialog';
import { MyDialogComponent } from '../my-dialog/my-dialog.component';
import { Firestore, collectionData, collection, addDoc, Query } from '@angular/fire/firestore';
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

  games$!: Observable<any[]>;

  constructor(private firestore: Firestore, public dialog: MatDialog) {}

  ngOnInit() {
    console.log('Firestore instance:', this.firestore);
    console.log('ngOnInit wurde aufgerufen');

    const gamesRef = collection(this.firestore, 'games');
    this.games$ = collectionData(gamesRef, { idField: 'id' });

    this.games$.subscribe((games) => {
      console.log('Spiele aus Firestore:', games); // ✅ Wird jetzt ausgeführt
    });
  }

  newGame() {
    this.game = new Game();
    const gameData = JSON.parse(JSON.stringify(this.game)); // wandelt in Plain Object um

    addDoc(collection(this.firestore, 'games'), gameData)
      .then((docRef) => {
        console.log('Game erfolgreich gespeichert mit ID:', docRef.id);
      })
      .catch((error) => {
        console.error('Fehler beim Speichern des Spiels:', error);
      });
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
