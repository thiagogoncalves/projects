import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class HomeService {

    private API: string = 'https://pokeapi.co/api/v2';

    constructor(
        private http: HttpClient){
    }

    getPokemon(): Observable<any> {
        return this.http.get(`${this.API}/pokemon/`);
    }

    getByUrl(url): Observable<any> {
        return this.http.get(url);
    }

}