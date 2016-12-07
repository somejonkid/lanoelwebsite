import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

import { Game } from '../types/game.type';

@Injectable()
export class GameService {
    private gameListURL = "http://lanoel.elasticbeanstalk.com/lanoel/"

    constructor(private http:Http){}    

    public getGamesList(): Promise<Game[]> {
        let headers = this.getHeaders();
        let URL = this.gameListURL + 'gamelist';

        return this.http.get(URL, {headers:headers})
                .toPromise()
                .then(response => response.json() as Game[])
                .catch(this.handleError)
    }

    private getHeaders(): Headers {
        let headers = new Headers();
        headers.append('X-Requested-With', 'XMLHttpRequest');
        return headers;
    }

        private handleError(error: any): Promise<any> {
        console.error('Error Occured in Games Service:', error);
        return Promise.reject(error.message || error);
    }
}