import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-start-screen',
  templateUrl: './start-screen.component.html',
  styleUrls: ['./start-screen.component.scss'],
})
export class StartScreenComponent {
  constructor(private router: Router) {}

  ngOnInit(): void {
    // Initiale Logik (falls nötig)
  }

  newGame() {
    //Start game
    this.router.navigateByUrl('/game');
  }
}
