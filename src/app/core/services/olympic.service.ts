import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { OlympicCountry } from '../models/Olympic';

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject<any>(undefined);

  constructor(private http: HttpClient) {}

  // Chargement initial des données avec gestion d'erreur
  loadInitialData() {
    return this.http.get<OlympicCountry[]>(this.olympicUrl).pipe(
      tap((value) => this.olympics$.next(value)),
      catchError((error, caught) => {
        console.error(error);
        this.olympics$.next(null);
        return caught;
      })
    );
  }

  // Méthode pour obtenir l'observable des données
  getOlympics() {
    return this.olympics$.asObservable();
  }

  // Méthode pour obtenir les données sous forme de tableau (avec gestion de l'asynchronisme)
  async getOlympicsData(): Promise<OlympicCountry[] | null> {
    // Si les données sont déjà présentes dans le BehaviorSubject, les retourner immédiatement
    if (this.olympics$.value !== undefined) {
      return this.olympics$.value;
    }

    // Sinon, attendre que les données soient chargées
    await this.loadInitialData().toPromise();

    return this.olympics$.value;
  }
  
}
