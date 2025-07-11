import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Firestore, collection, addDoc, getDoc } from '@angular/fire/firestore';
import { Game } from 'src/models/game';

@Component({
  selector: 'app-start-screen',
  templateUrl: './start-screen.component.html',
  styleUrls: ['./start-screen.component.scss'],
})
export class StartScreenComponent implements OnInit {
  constructor(private router: Router, private firestore: Firestore) {}

  ngOnInit(): void {
    // Initiale Logik (falls nötig)
  }

  newGame() {
    const game = new Game();
    const gamesRef = collection(this.firestore, 'games');
    addDoc(gamesRef, game.toJson())
      .then(async (docRef: any) => {
        console.log('Neues Spiel gespeichert mit ID:', docRef.id);

        // Dokumentdaten holen
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const gameInfo = docSnap.data();
          console.log('Spiel-Daten:', gameInfo);
        } else {
          console.log('Kein Dokument gefunden!');
        }

        this.router.navigate(['/game', docRef.id]);
      })
      .catch((error) => {
        console.error('Fehler beim Speichern:', error);
      });
  }
}
