import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChartConfiguration, ChartDataset, ChartOptions, ChartType } from 'chart.js';
import { Observable, of, Subscription } from 'rxjs';
import { OlympicCountry } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss']
})
export class CountryComponent implements OnInit, OnDestroy {
  public olympics$: Observable<any> = of(null);
  private subscription: Subscription | null = null;
  public selectedCountry: OlympicCountry | null = null;  // Ajoutez une variable pour stocker le pays trouvé
  
  

  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July'
    ],
    datasets: [
      {
        data: [ 65, 59, 80, 81, 56, 55, 40 ],
        label: 'Series A',
        fill: true,
        tension: 0.5,
        borderColor: 'black',
        backgroundColor: 'rgba(255,0,0,0.3)'
      }
    ]
  };
  public lineChartOptions: ChartOptions<'line'> = {
    responsive: false
  };
  public lineChartLegend = true;

  constructor(private olympicService: OlympicService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.olympicService.loadInitialData().subscribe();
    this.olympics$ = this.olympicService.getOlympics();

    this.subscription = this.olympics$.subscribe(data => {
      this.selectedCountry = this.foundCountry(data);
      console.log("Pays trouvé :", this.selectedCountry);
    });
  }

  foundCountry(data: OlympicCountry[]): OlympicCountry | null {
    const countryId = Number(this.route.snapshot.params['id']);
    return data.find(country => country.id === countryId) || null;
  }

  ngOnDestroy(): void {
    // Nettoyez les données lorsque le composant est détruit
    this.selectedCountry = null;  // Supprime la référence au pays sélectionné
    if (this.subscription) {
      this.subscription.unsubscribe();  // Annule l'abonnement pour éviter les fuites de mémoire
    }
    console.log("Pays sélectionné réinitialisé à null");
  }
}
