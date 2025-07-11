import { Component } from '@angular/core';
import { Game } from 'src/models/game';
import { MatDialog } from '@angular/material/dialog';
import { MyDialogComponent } from '../my-dialog/my-dialog.component';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router'; 
import { doc, docData } from '@angular/fire/firestore';

import {
  Firestore,
  collection,
  collectionData,
  addDoc,
} from '@angular/fire/firestore';

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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private firestore: Firestore,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const gameId = params['id'];

      if (gameId) {
        const gameDocRef = doc(this.firestore, 'games', gameId);
        docData(gameDocRef).subscribe((gameData: any) => {
          this.game = new Game();
          Object.assign(this.game, gameData);
          console.log('Live aktualisiertes Spiel:', this.game);
        });
      }
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
      }
    });
  }
}
