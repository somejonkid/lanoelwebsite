import { Component, OnInit } from '@angular/core';

import { Game } from '../../types/game.type';
import { GameService } from '../../services/games.service';

@Component ({
    selector: "navbar",
    templateUrl: "./navbar.component.html",
    styleUrls: ["./navbar.component.scss"]
})
export class NavbarComponent implements OnInit{
    private games: Game[];
    authenticated():boolean{return false;}

    constructor(private gameService:GameService){}

    ngOnInit(){
        this.gameService.getGamesList()
            .then(games => this.games = games);
    }

}