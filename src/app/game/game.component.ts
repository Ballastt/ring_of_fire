import { Component, OnInit } from '@angular/core';
import { Game } from 'src/models/game';
import { MatDialog } from '@angular/material/dialog';
import { MyDialogComponent } from '../my-dialog/my-dialog.component';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { doc, docData, updateDoc, Firestore } from '@angular/fire/firestore';
import { EditPlayerComponent } from '../edit-player/edit-player.component';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {
  game: Game = new Game();
  preloadImages: string[] = [];
  gameId: string | undefined = '';
  gameOver: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private firestore: Firestore,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.preloadImages = this.generateAllCardPaths();

    this.route.params.subscribe((params) => {
      this.gameId = params['id'];
      if (this.gameId) {
        const gameDocRef = doc(this.firestore, 'games', this.gameId);
        docData(gameDocRef).subscribe((gameData: any) => {
          this.game = new Game();
          Object.assign(this.game, gameData);
          this.fixGameData();
        });
      }
    });
  }

  fixGameData() {
    this.game.currentPlayer = +this.game.currentPlayer || 0;
    this.game.pickCardAnimation = !!this.game.pickCardAnimation;
    this.game.currentCard = this.game.currentCard || '';
    this.game.players = this.game.players ?? [];
    this.game.stack = this.game.stack ?? [];
    this.game.playedCards = this.game.playedCards ?? [];
    this.game.playerImages = this.game.playerImages ?? [];
  }

  generateAllCardPaths(): string[] {
    const suits = ['spade', 'hearts', 'diamonds', 'clubs'];
    const paths: string[] = [];

    for (let suit of suits) {
      for (let i = 1; i <= 13; i++) {
        paths.push(`assets/img/cards/${suit}_${i}.png`);
      }
    }

    return paths;
  }

  pickCard() {
    if (this.isStackEmpty()) {
      this.gameOver = true;
      return;
    }

    if (this.game.pickCardAnimation) {
      return;
    }

    this.startCardPick();
  }

  private isStackEmpty(): boolean {
    return this.game.stack.length === 0;
  }

  private startCardPick() {
    this.gameOver = false;
    this.game.currentCard = this.game.stack.pop() || '';
    this.game.pickCardAnimation = true;
    this.advancePlayer();

    setTimeout(() => this.finishCardPick(), 2000);
  }

  private advancePlayer() {
    this.game.currentPlayer =
      (this.game.currentPlayer + 1) % this.game.players.length;
  }

  private finishCardPick() {
    if (this.game.currentCard) {
      this.game.playedCards.push(this.game.currentCard);
    }
    this.game.pickCardAnimation = false;
    this.game.currentCard = '';
    this.saveGame();
  }

  openDialog(): void {
    (document.activeElement as HTMLElement)?.blur();
    const dialogRef = this.dialog.open(MyDialogComponent);

    dialogRef.afterClosed().subscribe((name: string) => {
      if (name && name.length > 0) {
        this.game.players.push(name);
        this.game.playerImages.push('female_avatar.png');
        const btn = document.querySelector('.add-btn') as HTMLButtonElement;
        btn?.focus();
        this.saveGame();
      }
    });
  }

  saveGame() {
    const gameRef = doc(this.firestore, 'games', this.gameId || '');
    updateDoc(gameRef, this.game.toJson());
  }

  editPlayer(playerId: number) {
    const dialogRef = this.dialog.open(EditPlayerComponent);
    dialogRef.afterClosed().subscribe((change: string | undefined) => {
      if (change) {
        if (change === 'DELETE') {
          this.game.players.splice(playerId, 1);
          this.game.playerImages.splice(playerId, 1);
        } else {
          this.game.playerImages[playerId] = change;
        }
        this.saveGame();
      }
    });
  }
}
