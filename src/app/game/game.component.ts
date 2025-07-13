import { Component, OnInit } from '@angular/core';
import { Game } from 'src/models/game';
import { MatDialog } from '@angular/material/dialog';
import { MyDialogComponent } from '../my-dialog/my-dialog.component';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { doc, docData, updateDoc, Firestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { EditPlayerComponent } from '../edit-player/edit-player.component';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {
  game: Game = new Game();
  gameId: string | undefined = '';

  games$!: Observable<any[]>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private firestore: Firestore,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.gameId = params['id'];
      console.log('Spiel-ID aus der URL:', this.gameId);
      if (this.gameId) {
        const gameDocRef = doc(this.firestore, 'games', this.gameId);
        docData(gameDocRef).subscribe((gameData: any) => {
          this.game = new Game();
          Object.assign(this.game, gameData);
          // Absicherung: aktuelle Werte prüfen und korrekt zuweisen
          this.game.currentPlayer = Number(this.game.currentPlayer) || 0;
          this.game.pickCardAnimation = !!this.game.pickCardAnimation;
          this.game.currentCard = this.game.currentCard || '';
          this.game.players = this.game.players || [];
          this.game.stack = this.game.stack || [];
          this.game.playedCards = this.game.playedCards || [];
          this.game.playerImages = this.game.playerImages || [];
          console.log('Aktuelles Spiel geladen:', this.game);
        });
      }
    });
  }

  pickCard() {
    console.log('[KLICK] pickCard() aufgerufen');
    if (!this.game.pickCardAnimation) {
      console.log('[OK] Animation nicht aktiv → Karte ziehen');

      this.game.currentCard = this.game.stack.pop() || '';
      this.game.pickCardAnimation = true;

      this.game.currentPlayer++;
      this.game.currentPlayer %= this.game.players.length;

      setTimeout(() => {
        if (this.game.currentCard) {
          this.game.playedCards.push(this.game.currentCard);
        }

        this.game.pickCardAnimation = false;
        this.game.currentCard = ''; // <- HIER setzen, nachdem sie ins Array ging

        this.saveGame();
        console.log('[ANIMATION ENDE] Karte gelegt & gespeichert');
      }, 2000);
    } else {
      console.log('[BLOCKIERT] Animation läuft noch – kein Ziehen möglich');
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(MyDialogComponent);

    dialogRef.afterClosed().subscribe((name: string) => {
      if (name && name.length > 0) {
        this.game.players.push(name);
        console.log('Dialog wurde geschlossen mit:', name);
        this.saveGame();
      }
    });
  }

  saveGame() {
    const gameRef = doc(this.firestore, 'games', this.gameId || '');
    updateDoc(gameRef, this.game.toJson())
      .then(() => {
        console.log('Spiel aktualisiert:', this.game);
        // Optional: Navigiere zurück zur Startseite oder führe eine andere Aktion aus
      })
      .catch((error) => {
        console.error('Fehler beim Aktualisieren des Spiels:', error);
      });
  }

  editPlayer(playerId: number) {
    console.log('[KLICK] editPlayer() aufgerufen', playerId);

    const dialogRef = this.dialog.open(EditPlayerComponent);
    dialogRef.afterClosed().subscribe((change: string) => {
      console.log("Received Change", change);
      
    });
  }
}
