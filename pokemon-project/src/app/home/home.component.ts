import { Component, OnInit, Inject } from '@angular/core';
import { HomeService } from './home.service';
import { SESSION_STORAGE, StorageService } from 'angular-webstorage-service';

const STORAGE_KEY = 'local_pokemon';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private homeService: HomeService,
    @Inject(SESSION_STORAGE) private storage: StorageService) { }

  pokemonArray: Array<any> = [];
  pokemonPagArray: Array<any> = [];
  pokemonStorage: any;
  page: number = 1;
  total: number = 0;
  isLoading: boolean = false;
  pokemonType: string = '';
  filter: string = '';
  isFiltering: boolean = false;

  ngOnInit() {
    this.isLoading = true;
    this.pokemonStorage = this.storage.get(STORAGE_KEY);
    if (this.pokemonStorage == null) {
      this.pokemonStorage = {
        favoritePokemon: []
      };
    }

    this.homeService.getPokemon().subscribe(pokemons => {
      this.pokemonArray = pokemons.results;
      this.total = pokemons.count;
      this.pokemonPagArray = this.pokemonArray.slice(0, 10);
      this.isLoading = false;
    });

  }

  filterPokemon() {
    if (this.filter.length >= 2) {
      this.isFiltering = true;
      this.pokemonPagArray = this.pokemonArray.filter(value => value.name.indexOf(this.filter) >= 0);
    } else if (this.filter.length == 0){
      this.filter = '';
      this.isFiltering = false;
      this.pokemonPagArray = this.pokemonArray.slice(0, 10);
    }
  }

  getLocationPokemon(url) {
    this.pokemonType = '';

    // get pokemon by URL.
    this.homeService.getByUrl(url).subscribe(pokemon => {
      
      // get pokemon type
      pokemon.types.forEach(element => {
        this.pokemonType = `${this.pokemonType} ${element.type.name}`;
      });

    });
  }

  addFavoritePokemon(pokemonName: string) {
    this.pokemonStorage.favoritePokemon.push(pokemonName);
    this.storeFavoritePokemon();
    this.pokemonStorage = this.getPokemonStorage();
  }

  removeFavoritePokemon(pokemonName: string) {
    
    let index = this.pokemonStorage.favoritePokemon.findIndex(value => value === pokemonName);
    if (index >= 0) {
      this.pokemonStorage.favoritePokemon.splice(index, 1);
      this.storeFavoritePokemon();
      this.pokemonStorage = this.getPokemonStorage();
    }

  }

  isFavoritePokemon(pokemonName: string) {
    return this.pokemonStorage.favoritePokemon.find(value => value === pokemonName) != undefined;
  }

  onChange(event) {
    this.pokemonPagArray = this.pokemonArray.slice(((event - 1) * 10), (event * 10));
  }

  private storeFavoritePokemon() {
    this.storage.set(STORAGE_KEY, this.pokemonStorage);
  }

  private getPokemonStorage() {
    return this.storage.get(STORAGE_KEY);
  }

}
