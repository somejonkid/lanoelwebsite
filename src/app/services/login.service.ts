import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

@Injectable()
export class LoginService {
    private loginURL: string = "https://accounts.omegasixcloud.net/accounts/"

    constructor(private http:Http){}

    public login(username:string, password:string): Promise<boolean> {
        let headers = new Headers();
        headers.append("username", username);
        headers.append("password", password)
        let URL = this.loginURL + 'login';

        return this.http.post(URL, "", {headers:headers})
                .toPromise()
                .then(response => {
                    if (response.headers.get("sessionid") != null)
                    {
                        sessionStorage.setItem("sessionid", response.headers.get("sessionid"))
                        sessionStorage.setItem("username", username)
                        return true;
                    }
                    return false;
                })
                .catch(this.handleError)
    }

    public isAuthenticated():boolean {
        if (sessionStorage.getItem("sessionid") != null)
        {
            return true;
        }
        return false;
    }

    private handleError(error: any): Promise<any> {
        console.error('Error Occured in Games Service:', error);
        return Promise.reject(error.message || error);
    }

}