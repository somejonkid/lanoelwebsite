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

    private validateGameHeader(game:Game): String
    {
        if (game.steamInfo == null || game.steamInfo.header_image == null)
        {
            return "http://dummyimage.com/600x400/000/fff&text=" + game.gameName;
        }

        return game.steamInfo.header_image;
    }

}